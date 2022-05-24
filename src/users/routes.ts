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
			id_role: number;
			email: string;
			username: string;
			firstname: string;
			lastname: string;
			phone_number: string;
			orderBy: string;
		};
	}
	server.register(bcrypt);
	//ajout middlware verif adminAccessOnly
	// scroll infini
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
			const id_role = Number(request.query.id_role);
			const email = Number(request.query.email);
			const username = Number(request.query.username);
			const firstname = Number(request.query.firstname);
			const lastname = Number(request.query.lastname);
			const phone_number = Number(request.query.phone_number);
			if (id_role) {
				filterArray.push(["id_role", id_role]);
			}
			if (email) {
				filterArray.push(["email", email]);
			}
			if (username) {
				filterArray.push(["username", username]);
			}
			if (firstname) {
				filterArray.push(["firstname", firstname]);
			}
			if (lastname) {
				filterArray.push(["lastname", lastname]);
			}
			if (phone_number) {
				filterArray.push(["phone_number", phone_number]);
			}

			const allUsers = await findAllUsers(filterArray, orderBy);
			reply.status(200).send(allUsers);
		}
	);

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
