import type { FastifyInstance } from "fastify";
import { paramsIdType } from "../commons/types";
import {
	findAllUsers,
	findUserById,
	createUser,
	updateUser,
	deleteUser,
	findUserByEmail,
	findUserByUsername,
} from "./dao";
import { User, UserType, UserUpdate, UserUpdateType } from "./types";

const userRouter = async (server: FastifyInstance) => {
	server.get("/", async (_request, reply) => {
		const allUsers = await findAllUsers();
		reply.status(200).send(allUsers);
	});

	server.get<{ Params: paramsIdType; Reply: UserType | string }>(
		"/:id",
		async (request, reply) => {
			const user = await findUserById(Number(request.params.id));
			if (user) {
				reply.status(200).send(user);
			} else {
				reply
					.status(404)
					.send(
						`id: ${request.params.id} ne correspond à aucun utilisateur existant`
					);
			}
		}
	);

	server.post<{ Body: UserType; Reply: UserType | string }>(
		"/",
		{
			schema: {
				body: User,
				response: {
					201: User,
				},
			},
		},
		async (request, reply) => {
			const { body: user } = request;
			const userEmailAlreadyExists = await findUserByEmail(user.email);
			let usernameAlreadyExists;
			if (user.username) {
				usernameAlreadyExists = await findUserByUsername(user.username);
			}

			if (userEmailAlreadyExists && usernameAlreadyExists) {
				reply.status(400).send("Cet email et ce pseudonyme existent déjà");
			} else if (userEmailAlreadyExists) {
				reply.status(400).send("Cet email existe déjà");
			} else if (usernameAlreadyExists) {
				reply.status(400).send("Ce pseudonyme existe déjà");
			} else {
				const userCreated = await createUser(user);
				reply.status(201).send(userCreated);
			}
		}
	);

	server.put<{
		Params: paramsIdType;
		Body: UserUpdateType;
		Reply: UserType | string;
	}>(
		"/:id",
		{
			schema: {
				body: UserUpdate,
				response: {
					200: User,
				},
			},
		},
		async (request, reply) => {
			const { body: user } = request;
			let userEmailAlreadyExists;
			let usernameAlreadyExists;
			if (user.email) {
				userEmailAlreadyExists = await findUserByEmail(user.email);
			}
			if (user.username) {
				usernameAlreadyExists = await findUserByUsername(user.username);
			}

			if (
				userEmailAlreadyExists &&
				userEmailAlreadyExists.id !== request.params.id &&
				usernameAlreadyExists &&
				usernameAlreadyExists.id !== request.params.id
			) {
				reply.status(400).send("Cet email et ce pseudonyme existent déjà");
			} else if (
				userEmailAlreadyExists &&
				userEmailAlreadyExists.id !== request.params.id
			) {
				reply.status(400).send("Cet email existe déjà");
			} else if (
				usernameAlreadyExists &&
				usernameAlreadyExists.id !== request.params.id
			) {
				reply.status(400).send("Ce pseudonyme existe déjà");
			} else {
				const userUpdated = await updateUser(Number(request.params.id), user);
				reply.status(200).send(userUpdated);
			}
		}
	);

	server.delete<{ Params: paramsIdType; Reply: string }>(
		"/:id",
		async (request, reply) => {
			await deleteUser(Number(request.params.id));
			reply.status(200).send(`Utilisateur ${request.params.id} supprimé`);
		}
	);
};

export default userRouter;
