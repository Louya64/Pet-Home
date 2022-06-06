import type { FastifyInstance } from "fastify";
import { ParamsIdType, ErrorType } from "../commons/types";
import { duplicateDataError } from "../commons/errorHelpers";
import {
	findAllAdoptionStatus,
	findAdoptionStatusById,
	createAdoptionStatus,
	updateAdoptionStatus,
	deleteAdoptionStatus,
	findAdoptionStatusByName,
} from "./dao";
import { AdoptionStatus, AdoptionStatusType } from "./types";
import { superAdminAccessOnly } from "../commons/accessMiddlewares";

const adoptionStatusRouter = async (server: FastifyInstance) => {
	interface FastifyRequest {
		Querystring: {
			orderBy: string;
		};
	}
	server.get<{
		Querystring: FastifyRequest["Querystring"];
		Reply: AdoptionStatusType[];
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
		const allAdoptionStatus = await findAllAdoptionStatus(orderBy);
		reply.status(200).send(allAdoptionStatus);
	});

	server.get<{ Params: ParamsIdType; Reply: AdoptionStatusType | ErrorType }>(
		"/:id",
		async (request, reply) => {
			const adoptionStatus = await findAdoptionStatusById(
				Number(request.params.id)
			);
			if (adoptionStatus) {
				reply.status(200).send(adoptionStatus);
			}
		}
	);

	server.post<{
		Body: AdoptionStatusType;
		Reply: AdoptionStatusType | ErrorType;
	}>(
		"/",
		{
			schema: {
				body: AdoptionStatus,
				response: {
					200: AdoptionStatus,
				},
			},
			preHandler: [superAdminAccessOnly],
		},
		async (request, reply) => {
			const { body: adoptionStatus } = request;
			const adoptionStatusNameAlreadyExists = await findAdoptionStatusByName(
				adoptionStatus.name
			);
			if (!adoptionStatusNameAlreadyExists) {
				const adoptionStatusCreated = await createAdoptionStatus(
					adoptionStatus
				);
				reply.status(200).send(adoptionStatusCreated);
			} else {
				reply
					.status(409)
					.send(duplicateDataError(`Ce statut d'adoption existe déjà`));
			}
		}
	);

	server.put<{
		Params: ParamsIdType;
		Body: AdoptionStatusType;
		Reply: AdoptionStatusType | ErrorType;
	}>(
		"/:id",
		{
			schema: {
				body: AdoptionStatus,
				response: {
					200: AdoptionStatus,
				},
			},
			preHandler: [superAdminAccessOnly],
		},
		async (request, reply) => {
			const { body: adoptionStatus } = request;
			let adoptionStatusNameAlreadyExists;
			if (adoptionStatus.name) {
				adoptionStatusNameAlreadyExists = await findAdoptionStatusByName(
					adoptionStatus.name
				);
			}
			if (!adoptionStatusNameAlreadyExists) {
				const adoptionStatusUpdated = await updateAdoptionStatus(
					Number(request.params.id),
					adoptionStatus
				);
				reply.status(200).send(adoptionStatusUpdated);
			} else {
				reply
					.status(409)
					.send(duplicateDataError(`Ce statut d'adoption existe déjà`));
			}
		}
	);

	server.delete<{ Params: ParamsIdType; Reply: string }>(
		"/:id",
		{ preHandler: [superAdminAccessOnly] },
		async (request, reply) => {
			await deleteAdoptionStatus(Number(request.params.id));
			reply.status(200).send(`Statut d'adoption ${request.params.id} supprimé`);
		}
	);
};

export default adoptionStatusRouter;
