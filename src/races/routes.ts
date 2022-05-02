import type { FastifyInstance, FastifyRequest } from "fastify";
import { ParamsIdType, ErrorType } from "../commons/types";
import { notFoundError, duplicateDataError } from "../commons/errorHelpers";
import {
	findAllRaces,
	findRaceById,
	createRace,
	updateRace,
	deleteRace,
	findRaceByName,
} from "./dao";
import { Race, RaceType, RaceUpdate, RaceUpdateType } from "./types";

// declare module "fastify" {
// 	interface FastifyRequest {
// 		Querystring: {
// 			id_category: number;
// 		};
// 	}
// }

const raceRouter = async (server: FastifyInstance) => {
	server.get<{ Querystring: FastifyRequest["Querystring"]; Reply: RaceType[] }>(
		"/",
		async (request, reply) => {
			let filter = {};

			const id_category = Number(request.query.id_category);

			if (id_category) {
				filter = {
					id_category: id_category,
				};
			}

			const allRaces = await findAllRaces(filter);
			reply.status(200).send(allRaces);
		}
	);

	server.get<{ Params: ParamsIdType; Reply: RaceType | ErrorType }>(
		"/:id",
		async (request, reply) => {
			const race = await findRaceById(Number(request.params.id));
			if (race) {
				reply.status(200).send(race);
			}
		}
	);

	server.post<{ Body: RaceType; Reply: RaceType | ErrorType }>(
		"/",
		{
			schema: {
				body: Race,
				response: {
					200: Race,
				},
			},
		},
		async (request, reply) => {
			const { body: race } = request;
			const raceNameAlreadyExists = await findRaceByName(race.name);
			if (!raceNameAlreadyExists) {
				const raceCreated = await createRace(race);
				reply.status(200).send(raceCreated);
			} else {
				reply.status(409).send(duplicateDataError(`Cette race existe déjà`));
			}
		}
	);

	server.put<{
		Params: ParamsIdType;
		Body: RaceUpdateType;
		Reply: RaceType | ErrorType;
	}>(
		"/:id",
		{
			schema: {
				body: RaceUpdate,
				response: {
					200: Race,
				},
			},
		},
		async (request, reply) => {
			const { body: race } = request;
			let raceNameAlreadyExists;
			if (race.name) {
				raceNameAlreadyExists = await findRaceByName(race.name);
			}
			if (!raceNameAlreadyExists) {
				const raceUpdated = await updateRace(Number(request.params.id), race);
				reply.status(200).send(raceUpdated);
			} else {
				reply.status(409).send(duplicateDataError(`Cette race existe déjà`));
			}
		}
	);

	server.delete<{ Params: ParamsIdType; Reply: string }>(
		"/:id",
		async (request, reply) => {
			await deleteRace(Number(request.params.id));
			reply.status(200).send(`Race ${request.params.id} supprimée`);
		}
	);
};

export default raceRouter;
