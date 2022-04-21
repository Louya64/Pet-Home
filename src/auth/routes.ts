import type { FastifyInstance } from "fastify";
import { ParamsIdType, ErrorType } from "../commons/types";
import { notFoundError, duplicateDataError } from "../commons/errorHelpers";
import { findUserByEmail, findUserByUsername } from "../users/dao";
import { createUser } from "./dao";
import {
	UserCreate,
	UserCreateType,
	UserCreateFromApp,
	UserCreateFromAppType,
	UserCreateAsAdmin,
	UserCreateAsAdminType,
} from "./types";
import { User, UserType } from "../users/types";
import bcrypt from "fastify-bcrypt";

// login + register
const authRouter = async (server: FastifyInstance) => {
	server.register(bcrypt);

	// register from site (role "utilisateur")
	server.post<{ Body: UserCreateFromAppType; Reply: UserType | ErrorType }>(
		"/auth/register",
		{
			schema: {
				body: UserCreateFromApp,
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
				reply
					.status(409)
					.send(duplicateDataError(`Cet email et ce pseudonyme existent déjà`));
			} else if (userEmailAlreadyExists) {
				reply.status(409).send(duplicateDataError(`Cet email existe déjà`));
			} else if (usernameAlreadyExists) {
				reply.status(409).send(duplicateDataError(`Ce pseudonyme existe déjà`));
			} else {
				const hashedPassword = await server.bcrypt.hash(user.password);
				const userToCreate: UserCreateType = {
					...user,
					id_role: 3,
					password: hashedPassword,
				};
				const userCreated = await createUser(userToCreate);

				// jwt + send token + redirect accueil
				reply.status(201).send(userCreated);
			}
		}
	);
};

export default authRouter;
