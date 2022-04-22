import type { FastifyInstance } from "fastify";
import { ParamsIdType, ErrorType } from "../commons/types";
import { notFoundError, duplicateDataError } from "../commons/errorHelpers";
import {
	findAllOfferStatuss,
	findOfferStatusById,
	createOfferStatus,
	updateOfferStatus,
	deleteOfferStatus,
	findOfferStatusByName,
} from "./dao";
import { OfferStatus, OfferStatusType } from "./types";

const offerStatusRouter = async (server: FastifyInstance) => {
	server.get<{ Reply: OfferStatusType[] }>("/", async (_request, reply) => {
		const allOfferStatus = await findAllOfferStatuss();
		reply.status(200).send(allOfferStatus);
	});

	server.get<{ Params: ParamsIdType; Reply: OfferStatusType | ErrorType }>(
		"/:id",
		async (request, reply) => {
			const offerStatus = await findOfferStatusById(Number(request.params.id));
			if (offerStatus) {
				reply.status(200).send(offerStatus);
			}
		}
	);

	server.post<{ Body: OfferStatusType; Reply: OfferStatusType | ErrorType }>(
		"/",
		{
			schema: {
				body: OfferStatus,
				response: {
					200: OfferStatus,
				},
			},
		},
		async (request, reply) => {
			const { body: offerStatus } = request;
			const offerStatusNameAlreadyExists = await findOfferStatusByName(
				offerStatus.name
			);
			if (!offerStatusNameAlreadyExists) {
				const offerStatusCreated = await createOfferStatus(offerStatus);
				reply.status(200).send(offerStatusCreated);
			} else {
				reply
					.status(409)
					.send(duplicateDataError(`Ce statut d'offre existe déjà`));
			}
		}
	);

	server.put<{
		Params: ParamsIdType;
		Body: OfferStatusType;
		Reply: OfferStatusType | ErrorType;
	}>(
		"/:id",
		{
			schema: {
				body: OfferStatus,
				response: {
					200: OfferStatus,
				},
			},
		},
		async (request, reply) => {
			const { body: offerStatus } = request;
			let offerStatusNameAlreadyExists;
			if (offerStatus.name) {
				offerStatusNameAlreadyExists = await findOfferStatusByName(
					offerStatus.name
				);
			}
			if (!offerStatusNameAlreadyExists) {
				const offerStatusUpdated = await updateOfferStatus(
					Number(request.params.id),
					offerStatus
				);
				reply.status(200).send(offerStatusUpdated);
			} else {
				reply
					.status(409)
					.send(duplicateDataError(`Ce statut d'offre existe déjà`));
			}
		}
	);

	server.delete<{ Params: ParamsIdType; Reply: string }>(
		"/:id",
		async (request, reply) => {
			await deleteOfferStatus(Number(request.params.id));
			reply.status(200).send(`Statut d'offre ${request.params.id} supprimé`);
		}
	);
};

export default offerStatusRouter;
