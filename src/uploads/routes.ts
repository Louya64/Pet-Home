import type { FastifyInstance } from "fastify";
import { findAllPhotos, updatePhoto, deletePhoto } from "./dao";
import { PhotoType, Photo, PhotoUpdateType, PhotoUpdate } from "./types";
import { ParamsIdType, ErrorType } from "../commons/types";
import { unlink } from "node:fs/promises";

const uploadsRouter = async (server: FastifyInstance) => {
	interface FastifyRequest {
		Querystring: {
			id_offer: number;
		};
	}
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
			const deletedPhoto = await deletePhoto(Number(request.params.id));
			try {
				await unlink(`./public/assets/${deletedPhoto.path}`);
			} catch (error) {
				console.log(error);
			}

			// if main is removed => set another main
			if (deletedPhoto.main) {
				const otherOfferPhotos = await findAllPhotos([
					{ id_offer: deletedPhoto.id_offer },
				]);
				if (otherOfferPhotos.length) {
					await updatePhoto(otherOfferPhotos[0].id, { main: true });
				}
			}
			reply.status(200).send(`Photo ${request.params.id} supprimée`);
		}
	);
};

export default uploadsRouter;
