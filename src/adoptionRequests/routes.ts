import type { FastifyInstance } from "fastify";
import { ParamsIdType, ErrorType } from "../commons/types";
import { notFoundError, duplicateDataError } from "../commons/errorHelpers";
import {
	findAllAdoptionRequests,
	findAdoptionRequestById,
	createAdoptionRequest,
	updateAdoptionRequest,
	deleteAdoptionRequest,
} from "./dao";
import {
	AdoptionRequest,
	AdoptionRequestType,
	AdoptionRequestUpdate,
	AdoptionRequestUpdateType,
} from "./types";

const adoptionRequestRouter = async (server: FastifyInstance) => {
	server.get<{ Reply: AdoptionRequestType[] }>("/", async (_request, reply) => {
		const allAdoptionRequests = await findAllAdoptionRequests();
		reply.status(200).send(allAdoptionRequests);
	});

	server.get<{ Params: ParamsIdType; Reply: AdoptionRequestType | ErrorType }>(
		"/:id",
		async (request, reply) => {
			const adoptionRequest = await findAdoptionRequestById(
				Number(request.params.id)
			);
			if (adoptionRequest) {
				reply.status(200).send(adoptionRequest);
			}
		}
	);

	server.post<{
		Body: AdoptionRequestType;
		Reply: AdoptionRequestType | ErrorType;
	}>(
		"/",
		{
			schema: {
				body: AdoptionRequest,
				response: {
					200: AdoptionRequest,
				},
			},
		},
		async (request, reply) => {
			const { body: adoptionRequest } = request;

			const adoptionRequestCreated = await createAdoptionRequest(
				adoptionRequest
			);
			reply.status(200).send(adoptionRequestCreated);
		}
	);

	server.put<{
		Params: ParamsIdType;
		Body: AdoptionRequestUpdateType;
		Reply: AdoptionRequestType | ErrorType;
	}>(
		"/:id",
		{
			schema: {
				body: AdoptionRequestUpdate,
				response: {
					200: AdoptionRequest,
				},
			},
		},
		async (request, reply) => {
			const { body: adoptionRequest } = request;

			const adoptionRequestUpdated = await updateAdoptionRequest(
				Number(request.params.id),
				adoptionRequest
			);
			reply.status(200).send(adoptionRequestUpdated);
		}
	);

	server.delete<{ Params: ParamsIdType; Reply: string }>(
		"/:id",
		async (request, reply) => {
			await deleteAdoptionRequest(Number(request.params.id));
			reply.status(200).send(`Candidature ${request.params.id} supprimée`);
		}
	);
};

export default adoptionRequestRouter;
