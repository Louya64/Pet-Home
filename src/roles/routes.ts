import type { FastifyInstance } from "fastify";
import { ParamsIdType, ErrorType } from "../commons/types";
import { notFoundError, duplicateDataError } from "../commons/errorHelpers";
import {
	findAllRoles,
	findRoleById,
	createRole,
	updateRole,
	deleteRole,
	findRoleByName,
} from "./dao";
import { Role, RoleType } from "./types";

const roleRouter = async (server: FastifyInstance) => {
	server.get("/", async (_request, reply) => {
		const allRoles = await findAllRoles();
		reply.status(200).send(allRoles);
	});

	server.get<{ Params: ParamsIdType; Reply: RoleType | ErrorType }>(
		"/:id",
		async (request, reply) => {
			const role = await findRoleById(Number(request.params.id));
			if (role) {
				reply.status(200).send(role);
			} else {
				reply
					.status(404)
					.send(
						notFoundError(
							`id: ${request.params.id} ne correspond à aucun rôle existant`
						)
					);
			}
		}
	);

	server.post<{ Body: RoleType; Reply: RoleType | ErrorType }>(
		"/",
		{
			schema: {
				body: Role,
				response: {
					200: Role,
				},
			},
		},
		async (request, reply) => {
			const { body: role } = request;
			const roleNameAlreadyExists = await findRoleByName(role.name);
			if (!roleNameAlreadyExists) {
				const roleCreated = await createRole(role);
				reply.status(200).send(roleCreated);
			} else {
				reply.status(409).send(duplicateDataError(`Ce rôle existe déjà`));
			}
		}
	);

	server.put<{
		Params: ParamsIdType;
		Body: RoleType;
		Reply: RoleType | ErrorType;
	}>(
		"/:id",
		{
			schema: {
				body: Role,
				response: {
					200: Role,
				},
			},
		},
		async (request, reply) => {
			const { body: role } = request;
			const roleNameAlreadyExists = await findRoleByName(role.name);
			if (!roleNameAlreadyExists) {
				const roleUpdated = await updateRole(Number(request.params.id), role);
				reply.status(200).send(roleUpdated);
			} else {
				reply.status(409).send(duplicateDataError(`Ce rôle existe déjà`));
			}
		}
	);

	server.delete<{ Params: ParamsIdType; Reply: string }>(
		"/:id",
		async (request, reply) => {
			await deleteRole(Number(request.params.id));
			reply.status(200).send(`Rôle ${request.params.id} supprimé`);
		}
	);
};

export default roleRouter;
