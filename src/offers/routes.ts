import type { FastifyInstance, FastifyRequest } from "fastify";
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
	server.get<{
		Querystring: FastifyRequest["Querystring"];
		Reply: OfferReplyType[];
	}>("/", async (request, reply) => {
		let filterArray = [];
		const animal_name = request.query.animal_name;
		const id_category = Number(request.query.id_category);
		const id_race = Number(request.query.id_race);
		const zipcode = Number(request.query.zipcode);
		const city = request.query.city;
		const age = request.query.age;

		filterArray.push(["id_status", { not: 3 }]);

		if (animal_name) {
			filterArray.push(["animal_name", animal_name]);
		}
		if (id_category) {
			filterArray.push(["id_category", id_category]);
		}
		if (id_race) {
			filterArray.push(["id_race", id_race]);
		}
		if (zipcode) {
			filterArray.push(["zipcode", zipcode]);
		}
		if (city) {
			filterArray.push(["city", city]);
		}
		if (age) {
			const minAge = Number(age.split("-")[0]);
			const maxAge = Number(age.split("-")[1]);
			filterArray.push(["age", { gte: minAge, lte: maxAge }]);
		}

		const allOffers = await findAllOffers(filterArray);
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
