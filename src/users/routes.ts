import type { FastifyInstance } from "fastify";
import bcrypt from "fastify-bcrypt";
import { ParamsIdType, ErrorType } from "../commons/types";
import {
	notFoundError,
	duplicateDataError,
	unauthorizedError,
} from "../commons/errorHelpers";
import {
	adminAccessOnly,
	ownerAccessOnly,
	ownerOrAdminAccessOnly,
} from "../commons/accessMiddlewares";
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
	updatePassword,
	deleteUser,
	findUserByEmail,
} from "./dao";
import {
	User,
	UserType,
	UserUpdate,
	UserUpdateType,
	UserPasswordUpdate,
	UserPasswordUpdateType,
} from "./types";

const userRouter = async (server: FastifyInstance) => {
	interface FastifyRequest {
		Querystring: {
			orderBy: string;
			search: string;
			limit: string;
			offset: string;
		};
	}
	server.register(bcrypt);
	server.get<{ Querystring: FastifyRequest["Querystring"]; Reply: UserType[] }>(
		"/",
		{ preHandler: [adminAccessOnly] },
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
			const limit = Number(request.query.limit) || 99;
			const offset = Number(request.query.offset) || 0;

			if (search) {
				filterArray.push([search.split("-")[0], search.split("-")[1]]);
			}
			const allUsers = await findAllUsers(filterArray, orderBy, limit, offset);
			reply.status(200).send(allUsers);
		}
	);

	server.get<{ Params: ParamsIdType; Reply: UserType | ErrorType }>(
		"/:id",
		{ preHandler: [ownerOrAdminAccessOnly] },
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
			preHandler: [ownerAccessOnly],
		},
		async (request, reply) => {
			const { body: user } = request;
			let newPassword = "";

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

	server.put<{
		Params: ParamsIdType;
		Body: UserPasswordUpdateType;
		Reply: string | ErrorType;
	}>(
		"/:id/password",
		{
			schema: {
				body: UserPasswordUpdate,
				response: {
					200: User,
				},
			},
			preHandler: [ownerAccessOnly],
		},
		async (request, reply) => {
			const { body: passwords } = request;
			let newPassword = "";

			const newPasswordFormatOk = checkPasswordFormat(passwords.password);
			const confirmPasswordOk = confirmPassword(
				passwords.password,
				passwords.confirmedPassword
			);
			if (newPasswordFormatOk && confirmPasswordOk) {
				newPassword = await hashPassword(server, passwords.password);
			}

			await updatePassword(Number(request.params.id), newPassword);
			reply.status(200).send("ok");
		}
	);

	server.delete<{ Params: ParamsIdType; Reply: string }>(
		"/:id",
		{ preHandler: [ownerOrAdminAccessOnly] },
		async (request, reply) => {
			await deleteUser(Number(request.params.id));
			reply.status(200).send(`Utilisateur ${request.params.id} supprimé`);
		}
	);
};

export default userRouter;
