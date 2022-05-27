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
	AdoptionRequestCreate,
	AdoptionRequestCreateType,
	AdoptionRequestUpdate,
	AdoptionRequestUpdateType,
} from "./types";
import { createMessage } from "../messages/dao";

const adoptionRequestRouter = async (server: FastifyInstance) => {
	interface FastifyRequest {
		Querystring: {
			userId: string;
			orderBy: string;
		};
	}
	server.get<{
		Querystring: FastifyRequest["Querystring"];
		Reply: AdoptionRequestType[];
	}>("/", async (request, reply) => {
		let orderBy = {};
		if (request.query.orderBy) {
			orderBy = {
				[request.query.orderBy.split("-")[0]]:
					request.query.orderBy.split("-")[1],
			};
		} else {
			orderBy = {
				creation_date: "desc",
			};
		}

		let filterArray: [string, string | number | Object][] = [];
		const userId = Number(request.query.userId);

		if (userId) {
			filterArray.push(["id_candidate", userId]);
		}

		const allAdoptionRequests = await findAllAdoptionRequests(
			filterArray,
			orderBy
		);
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
		Body: AdoptionRequestCreateType;
		Reply: AdoptionRequestType | ErrorType;
	}>(
		"/",
		{
			schema: {
				body: AdoptionRequestCreate,
				response: {
					200: AdoptionRequest,
				},
			},
		},
		async (request, reply) => {
			const { body: adoptionRequest } = request;
			const bodyMessage = adoptionRequest.message;

			const adoptionRequestToCreate: AdoptionRequestType = adoptionRequest;
			delete adoptionRequestToCreate.message;
			const adoptionRequestCreated = await createAdoptionRequest(
				adoptionRequestToCreate
			);

			const messageCreated = await createMessage({
				id_adoption_request: adoptionRequestCreated.id,
				id_author: adoptionRequest.id_candidate || null,
				text: bodyMessage,
			});

			// => create message
			// id_adoption_request = adoptionRequestCreated.id
			// id_author = adoptionRequest.id_candidate || null
			// text = adoptionRequest.message

			// si candidate_id !== null => créer conv sinon qquoi ?
			// comment créer un échange dans dashbord qui passe soit que par les mails, soit mails + conv
			// comment afficher les mails reçus et envoyés dans dashbord...
			// est-ce que depuis une boite mail, on peut envoyer du contenu sur dashboard (genre rediriger)?
			// si + conv... pas en double...
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
