import type { FastifyInstance } from "fastify";
import { ParamsIdType, ErrorType } from "../commons/types";
import { duplicateDataError } from "../commons/errorHelpers";
import {
	findAllOfferStatus,
	findOfferStatusById,
	createOfferStatus,
	updateOfferStatus,
	deleteOfferStatus,
	findOfferStatusByName,
} from "./dao";
import { OfferStatus, OfferStatusType } from "./types";
import { superAdminAccessOnly } from "../commons/accessMiddlewares";

const offerStatusRouter = async (server: FastifyInstance) => {
	interface FastifyRequest {
		Querystring: {
			orderBy: string;
		};
	}
	server.get<{
		Querystring: FastifyRequest["Querystring"];
		Reply: OfferStatusType[];
	}>("/", async (request, reply) => {
		let orderBy = {};
		if (request.query.orderBy) {
			orderBy = {
				[request.query.orderBy.split("-")[0]]:
					request.query.orderBy.split("-")[1],
			};
		} else {
			orderBy = {
				id: "asc",
			};
		}
		const allOfferStatus = await findAllOfferStatus(orderBy);
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
			preHandler: [superAdminAccessOnly],
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
			preHandler: [superAdminAccessOnly],
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
		{ preHandler: [superAdminAccessOnly] },
		async (request, reply) => {
			await deleteOfferStatus(Number(request.params.id));
			reply.status(200).send(`Statut d'offre ${request.params.id} supprimé`);
		}
	);
};

export default offerStatusRouter;
