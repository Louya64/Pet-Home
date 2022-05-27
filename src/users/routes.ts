import type { FastifyInstance } from "fastify";
import bcrypt from "fastify-bcrypt";
import { ParamsIdType, ErrorType } from "../commons/types";
import {
	notFoundError,
	duplicateDataError,
	invalidDataError,
	unauthorizedError,
} from "../commons/errorHelpers";
import {
	hashPassword,
	checkPasswordFormat,
	confirmPassword,
	duplicatedData,
	verifyPassword,
} from "../auth/helpers";
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
	interface FastifyRequest {
		Querystring: {
			orderBy: string;
			search: string;
		};
	}
	server.register(bcrypt);
	server.get<{ Querystring: FastifyRequest["Querystring"]; Reply: UserType[] }>(
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
			const search = request.query.search;

			if (search) {
				filterArray.push([search.split("-")[0], search.split("-")[1]]);
			}
			const allUsers = await findAllUsers(filterArray, orderBy);
			reply.status(200).send(allUsers);
		}
	);

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
			let newPassword = "";

			// check pass // login if user.lastPassword
			if (user.lastPassword && user.password && user.confirmedPassword) {
				const userFound = await findUserByEmail(user.email);
				if (!userFound) {
					reply
						.status(401)
						.send(unauthorizedError(`Email ou mot de passe incorrect`));
				}
				if (userFound) {
					const passwordOk = await verifyPassword(
						server,
						user.lastPassword,
						userFound.password as string
					);
					if (!passwordOk) {
						reply
							.status(401)
							.send(unauthorizedError(`Email ou mot de passe incorrect`));
					}
					if (passwordOk) {
						const newPasswordFormatOk = checkPasswordFormat(user.password);
						const confirmPasswordOk = confirmPassword(
							user.password,
							user.confirmedPassword
						);
						if (newPasswordFormatOk && confirmPasswordOk) {
							newPassword = await hashPassword(server, user.password);
						}
					}
				}
			}

			const duplicateDataErrorMessage = await duplicatedData(
				user.username,
				user.email,
				Number(request.params.id)
			);

			if (duplicateDataErrorMessage) {
				reply.status(409).send(duplicateDataError(duplicateDataErrorMessage));
			} else {
				let userToUpdate = user;
				if (newPassword) {
					userToUpdate = {
						...user,
						password: newPassword,
					};
					delete userToUpdate.confirmedPassword;
					delete userToUpdate.lastPassword;
				}

				const userUpdated = await updateUser(
					Number(request.params.id),
					userToUpdate
				);
				reply.status(200).send(userUpdated);
			}
		}
	);

	server.delete<{ Params: ParamsIdType; Reply: string }>(
		"/:id",
		async (request, reply) => {
			await deleteUser(Number(request.params.id));
			reply.status(200).send(`Utilisateur ${request.params.id} supprimé`);
		}
	);
};

export default userRouter;
