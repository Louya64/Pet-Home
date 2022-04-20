import type { FastifyInstance } from "fastify";
import { paramsIdType } from "../commons/types";
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

	server.get<{ Params: paramsIdType; Reply: RoleType | string }>(
		"/:id",
		async (request, reply) => {
			const role = await findRoleById(Number(request.params.id));
			if (role) {
				reply.status(200).send(role);
			} else {
				reply
					.status(404)
					.send(`id: ${request.params.id} ne correspond à aucun rôle existant`);
			}
		}
	);

	server.post<{ Body: RoleType; Reply: RoleType | string }>(
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
				reply.status(400).send("Ce rôle existe déjà");
			}
		}
	);

	server.put<{
		Params: paramsIdType;
		Body: RoleType;
		Reply: RoleType | string;
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
				reply.status(400).send("Ce rôle existe déjà");
			}
		}
	);

	server.delete<{ Params: paramsIdType; Reply: string }>(
		"/:id",
		async (request, reply) => {
			await deleteRole(Number(request.params.id));
			reply.status(200).send(`Rôle ${request.params.id} supprimé`);
		}
	);
};

export default roleRouter;
