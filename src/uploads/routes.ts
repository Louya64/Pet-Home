import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import multer from "fastify-multer";
import { File, FilesObject } from "fastify-multer/lib/interfaces";
import { createPhoto, findAllPhotos, updatePhoto, deletePhoto } from "./dao";
import { PhotoType, Photo, PhotoUpdateType, PhotoUpdate } from "./types";
import { ParamsIdType, ErrorType } from "../commons/types";

type FilesInRequest = FilesObject | Partial<File>[];

declare module "fastify" {
	interface FastifyRequest {
		file: File;
		files: FilesInRequest;
	}
}

const storage = multer.diskStorage({
	destination: function (_req, _file, cb) {
		cb(null, "./public/assets/");
	},
	filename: function (_req, file, cb) {
		cb(null, Date.now() + file.originalname);
	},
});

const upload = multer({ storage: storage });

const uploadsRouter = async (server: FastifyInstance) => {
	server.get<{
		Querystring: FastifyRequest["Querystring"];
		Reply: PhotoType[];
	}>("/", async (request, reply) => {
		let filterArray = [];
		const id_offer = Number(request.query.id_offer);
		if (id_offer) {
			filterArray.push({ id_offer: id_offer });
		}

		const allPhotos = await findAllPhotos(filterArray);
		reply.status(200).send(allPhotos);
	});

	server.post(
		"/",
		{
			preHandler: upload.array("photos", 25),
		},
		async (request, reply) => {
			const photos = request.files as Partial<File>[];
			const photosPath: string[] = [];
			photos.map((photo: any) => {
				photosPath.push(photo.filename);
			});
			reply.status(200).send(photosPath);
		}
	);

	server.post<{ Body: PhotoType; Reply: PhotoType | ErrorType }>(
		"/store",
		{
			schema: {
				body: Photo,
				response: {
					200: Photo,
				},
			},
		},
		async (request, reply) => {
			const { body: photo } = request;
			const photoCreated = await createPhoto(photo);
			reply.status(200).send(photoCreated);
		}
	);

	server.put<{
		Params: ParamsIdType;
		Body: PhotoUpdateType;
		Reply: PhotoType | ErrorType;
	}>(
		"/:id",
		{
			schema: {
				body: PhotoUpdate,
				response: {
					200: Photo,
				},
			},
		},
		async (request, reply) => {
			const { body: photo } = request;
			const photoUpdated = await updatePhoto(Number(request.params.id), photo);
			reply.status(200).send(photoUpdated);
		}
	);

	server.delete<{ Params: ParamsIdType; Reply: string }>(
		"/:id",
		async (request, reply) => {
			await deletePhoto(Number(request.params.id));
			reply.status(200).send(`Photo ${request.params.id} supprimée`);
		}
	);
};

export default uploadsRouter;
