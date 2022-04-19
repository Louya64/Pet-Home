import type { FastifyInstance, FastifyReply } from "fastify";
import { paramsIdType } from "../paramsIdModel";
import {
	findAllRoles,
	findRoleById,
	createRole,
	updateRole,
	deleteRole,
} from "./dao";
import { Role, RoleType } from "./types";

const roleRouter = async (server: FastifyInstance) => {
	server.get("/", async (request, reply) => {
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

	server.post<{ Body: RoleType; Reply: RoleType }>(
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
			const roleCreated = await createRole(role);
			reply.status(200).send(roleCreated);
		}
	);

	server.put<{ Params: paramsIdType; Body: RoleType; Reply: RoleType }>(
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
			const roleUpdated = await updateRole(Number(request.params.id), role);
			reply.status(200).send(roleUpdated);
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
