import type { FastifyInstance, FastifyRequest } from "fastify";
import bcrypt from "fastify-bcrypt";
import { ParamsIdType, ErrorType } from "../commons/types";
import {
	notFoundError,
	duplicateDataError,
	invalidDataError,
} from "../commons/errorHelpers";
import {
	hashPassword,
	checkPasswordFormat,
	confirmPassword,
} from "../auth/authHelpers";
import {
	findAllUsers,
	findUserById,
	updateUser,
	deleteUser,
	findUserByEmail,
	findUserByUsername,
} from "./dao";
import { User, UserType, UserUpdate, UserUpdateType } from "./types";

declare module "fastify" {
	interface FastifyRequest {
		Querystring: {
			id_role: number;
			email: string;
			username: string;
			firstname: string;
			lastname: string;
			phone_number: string;
			order: string;
			desc: boolean;
			id_category: number;
		};
	}
}

const userRouter = async (server: FastifyInstance) => {
	server.register(bcrypt);
	//ajout middlware verif adminAccessOnly
	// scroll infini
	server.get<{ Querystring: FastifyRequest["Querystring"]; Reply: UserType[] }>(
		"/",
		async (request, reply) => {
			let filter = {};
			let orderBy = {};

			// filters
			const id_role = Number(request.query.id_role);
			const email = Number(request.query.email);
			const username = Number(request.query.username);
			const firstname = Number(request.query.firstname);
			const lastname = Number(request.query.lastname);
			const phone_number = Number(request.query.phone_number);
			if (id_role) {
				filter = {
					id_role: id_role,
				};
			}
			if (email) {
				filter = {
					email: email,
				};
			}
			if (username) {
				filter = {
					username: username,
				};
			}
			if (firstname) {
				filter = {
					firstname: firstname,
				};
			}
			if (lastname) {
				filter = {
					lastname: lastname,
				};
			}
			if (phone_number) {
				filter = {
					phone_number: phone_number,
				};
			}

			// orderBy
			const order = request.query.order;
			const desc = request.query.desc;
			if (order && desc) {
				orderBy = {
					[order]: "desc",
				};
			} else if (order) {
				orderBy = {
					[order]: "asc",
				};
			} else {
				orderBy = {
					id: "asc",
				};
			}

			const allUsers = await findAllUsers(filter, orderBy);
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
				let userToUpdate = user;
				if (user.password) {
					if (
						!user.confirmedPassword ||
						!confirmPassword(user.password, user.confirmedPassword)
					) {
						reply
							.status(422)
							.send(
								invalidDataError(
									`Le mot de passe n'a pas été confirmé correctement`
								)
							);
					} else {
						if (!checkPasswordFormat(user.password)) {
							reply
								.status(422)
								.send(
									invalidDataError(
										`Le mot de passe ne respecte pas le modèle(au moins 8 caractères dont 1 nombre, 1 minuscule, 1 majuscule, et 1 caractère spécial parmis *.!@#$%^&(){}[:;<>,.?/~_+-=|)`
									)
								);
						} else {
							const hashedPassword = await hashPassword(server, user.password);
							userToUpdate = {
								...user,
								password: hashedPassword,
							};
							delete userToUpdate.confirmedPassword;
						}
					}
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
