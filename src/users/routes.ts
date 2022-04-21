import type { FastifyInstance } from "fastify";
import { ParamsIdType, ErrorType } from "../commons/types";
import { notFoundError, duplicateDataError } from "../commons/errorHelpers";
import {
	findAllUsers,
	findUserById,
	updateUser,
	deleteUser,
	findUserByEmail,
	findUserByUsername,
} from "./dao";
import { User, UserType, UserUpdate, UserUpdateType } from "./types";

const userRouter = async (server: FastifyInstance) => {
	//ajout middlware verif adminAccessOnly
	server.get<{ Reply: UserType[] }>("/", async (_request, reply) => {
		const allUsers = await findAllUsers();
		reply.status(200).send(allUsers);
	});

	//ajout middlware verif adminOrOwnerAccessOnly
	server.get<{ Params: ParamsIdType; Reply: UserType | ErrorType }>(
		"/:id",
		async (request, reply) => {
			const user = await findUserById(Number(request.params.id));

			if (user) {
				reply.status(200).send(user);
			} else {
				reply
					.status(404)
					.send(
						notFoundError(
							`id: ${request.params.id} ne correspond à aucun utilisateur existant`
						)
					);
			}
		}
	);

	//ajout middlware verif adminOrOwnerAccessOnly
	server.put<{
		Params: ParamsIdType;
		Body: UserUpdateType;
		Reply: UserType | ErrorType;
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
				reply
					.status(409)
					.send(duplicateDataError(`Cet email et ce pseudonyme existent déjà`));
			} else if (
				userEmailAlreadyExists &&
				userEmailAlreadyExists.id !== request.params.id
			) {
				reply.status(409).send(duplicateDataError(`Cet email existe déjà`));
			} else if (
				usernameAlreadyExists &&
				usernameAlreadyExists.id !== request.params.id
			) {
				reply.status(409).send(duplicateDataError(`Ce pseudonyme existe déjà`));
			} else {
				// if user.password -> hash
				const userUpdated = await updateUser(Number(request.params.id), user);
				reply.status(200).send(userUpdated);
			}
		}
	);

	//ajout middlware verif adminOrOwnerAccessOnly
	server.delete<{ Params: ParamsIdType; Reply: string }>(
		"/:id",
		async (request, reply) => {
			await deleteUser(Number(request.params.id));
			reply.status(200).send(`Utilisateur ${request.params.id} supprimé`);
		}
	);
};

export default userRouter;
