import type { FastifyInstance } from "fastify";
import { ParamsIdType, ErrorType } from "../commons/types";
import { notFoundError, duplicateDataError } from "../commons/errorHelpers";
import {
	findAllOffers,
	findOfferById,
	createOffer,
	updateOffer,
	deleteOffer,
} from "./dao";
import {
	Offer,
	OfferType,
	OfferUpdate,
	OfferUpdateType,
	OfferReply,
	OfferReplyType,
} from "./types";

const offerRouter = async (server: FastifyInstance) => {
	server.get<{ Reply: OfferReplyType[] }>("/", async (_request, reply) => {
		const allOffers = await findAllOffers();
		reply.status(200).send(allOffers);
	});

	server.get<{ Params: ParamsIdType; Reply: OfferType | ErrorType }>(
		"/:id",
		async (request, reply) => {
			const offer = await findOfferById(Number(request.params.id));
			if (offer) {
				reply.status(200).send(offer);
			}
		}
	);

	server.post<{ Body: OfferType; Reply: OfferType | ErrorType }>(
		"/",
		{
			schema: {
				body: Offer,
				response: {
					200: Offer,
				},
			},
		},
		async (request, reply) => {
			const { body: offer } = request;

			const offerCreated = await createOffer(offer);
			reply.status(200).send(offerCreated);
		}
	);

	server.put<{
		Params: ParamsIdType;
		Body: OfferUpdateType;
		Reply: OfferType | ErrorType;
	}>(
		"/:id",
		{
			schema: {
				body: OfferUpdate,
				response: {
					200: Offer,
				},
			},
		},
		async (request, reply) => {
			const { body: offer } = request;

			const offerUpdated = await updateOffer(Number(request.params.id), offer);
			reply.status(200).send(offerUpdated);
		}
	);

	server.delete<{ Params: ParamsIdType; Reply: string }>(
		"/:id",
		async (request, reply) => {
			await deleteOffer(Number(request.params.id));
			reply.status(200).send(`Offre ${request.params.id} supprimée`);
		}
	);
};

export default offerRouter;
