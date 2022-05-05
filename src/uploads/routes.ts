import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import multer from "fastify-multer";
import { File, FilesObject } from "fastify-multer/lib/interfaces";
import { createPhoto, findAllPhotos } from "./dao";
import { PhotoType, Photo } from "./types";
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
};

export default uploadsRouter;
