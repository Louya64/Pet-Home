import type { FastifyInstance } from "fastify";
import { ParamsIdType, ErrorType } from "../commons/types";
import { duplicateDataError } from "../commons/errorHelpers";
import {
	findAllRaces,
	findRaceById,
	createRace,
	updateRace,
	deleteRace,
	findRaceByName,
} from "./dao";
import { Race, RaceType, RaceUpdate, RaceUpdateType } from "./types";
import { adminAccessOnly } from "../commons/accessMiddlewares";

const raceRouter = async (server: FastifyInstance) => {
	interface FastifyRequest {
		Querystring: {
			id_category: number;
			orderBy: string;
		};
	}
	server.get<{ Querystring: FastifyRequest["Querystring"]; Reply: RaceType[] }>(
		"/",
		async (request, reply) => {
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

			let filterArray: [string, string | number | Object][] = [];
			const id_category = Number(request.query.id_category);

			if (id_category) {
				filterArray.push(["id_category", id_category]);
			}

			const allRaces = await findAllRaces(filterArray, orderBy);
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
			preHandler: [adminAccessOnly],
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
			preHandler: [adminAccessOnly],
		},
		async (request, reply) => {
			const { body: race } = request;
			let raceNameAlreadyExists = false;
			if (race.name) {
				const raceFound = await findRaceByName(race.name);
				if (raceFound && raceFound.id !== race.id) {
					raceNameAlreadyExists = true;
				}
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
		{ preHandler: [adminAccessOnly] },
		async (request, reply) => {
			await deleteRace(Number(request.params.id));
			reply.status(200).send(`Race ${request.params.id} supprimée`);
		}
	);
};

export default raceRouter;
