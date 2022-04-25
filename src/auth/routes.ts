import type { FastifyInstance } from "fastify";
import { ParamsIdType, ErrorType } from "../commons/types";
import {
	notFoundError,
	duplicateDataError,
	unauthorizedError,
	forbiddenError,
	invalidDataError,
} from "../commons/errorHelpers";
import { findUserByEmail, findUserByUsername } from "../users/dao";
import { createUser } from "./dao";
import {
	UserCreate,
	UserCreateType,
	UserCreateFromApp,
	UserCreateFromAppType,
	UserCreateFromDashboard,
	UserCreateFromDashboardType,
	UserLogin,
	UserLoginType,
	Token,
	TokenType,
} from "./types";
import bcrypt from "fastify-bcrypt";
import {
	hashPassword,
	verifyPassword,
	createToken,
	checkPasswordFormat,
} from "./authHelpers";

// login(site, bo, facebook) + register(site, bo, facebook)
const authRouter = async (server: FastifyInstance) => {
	server.register(bcrypt);

	// register from site (role auto "utilisateur")
	server.post<{ Body: UserCreateFromAppType; Reply: TokenType | ErrorType }>(
		"/auth/register",
		{
			schema: {
				body: UserCreateFromApp,
				response: {
					201: Token,
				},
			},
		},
		async (request, reply) => {
			const { body: user } = request;

			const userEmailAlreadyExists = await findUserByEmail(user.email);

			if (userEmailAlreadyExists) {
				reply.status(409).send(duplicateDataError(`Cet email existe déjà`));
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
					const userToCreate: UserCreateType = {
						...user,
						id_role: 3,
						password: hashedPassword,
					};
					const userCreated = await createUser(userToCreate);
					const token = createToken(server, userCreated);
					reply.status(201).send(token);
				}
			}
		}
	);

	// register from dashboard
	server.post<{ Body: UserCreateFromDashboardType; Reply: string | ErrorType }>(
		"/dashboard/auth/register",
		{
			schema: {
				body: UserCreateFromDashboard,
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
					const userToCreate: UserCreateType = {
						...user,
						password: hashedPassword,
					};
					const userCreated = await createUser(userToCreate);
					reply
						.status(201)
						.send(`L'utilisateur ${userCreated.id} a bien été enregistré`);
				}
			}
		}
	);

	// login with email / password from site
	server.post<{ Body: UserLoginType; Reply: TokenType | ErrorType }>(
		"/auth/login",
		{
			schema: {
				body: UserLogin,
				response: {
					200: Token,
				},
			},
		},
		async (request, reply) => {
			const { body: credentials } = request;
			const userFound = await findUserByEmail(credentials.email);
			if (!userFound) {
				reply
					.status(401)
					.send(
						unauthorizedError(
							`Email ou mot de passe incorrect (si vous avez crée un compte avec facebook, il faut vous connecter avec facebook)`
						)
					);
			} else {
				const passwordOk = await verifyPassword(
					server,
					credentials.password,
					userFound.password as string
				);
				if (!passwordOk) {
					reply
						.status(401)
						.send(
							unauthorizedError(
								`Email ou mot de passe incorrect (si vous avez crée un compte avec facebook, il faut vous connecter avec facebook)`
							)
						);
				} else {
					const token = createToken(server, userFound);
					reply.status(200).send(token);
				}
			}
		}
	);

	// login with email / password from dashboard
	server.post<{ Body: UserLoginType; Reply: TokenType | ErrorType }>(
		"/dashboard/auth/login",
		{
			schema: {
				body: UserLogin,
				response: {
					200: Token,
				},
			},
		},
		async (request, reply) => {
			const { body: credentials } = request;
			const userFound = await findUserByEmail(credentials.email);
			if (!userFound) {
				reply
					.status(401)
					.send(
						unauthorizedError(
							`Email ou mot de passe incorrect (si vous avez crée un compte avec facebook, il faut vous connecter avec facebook)`
						)
					);
			} else {
				const passwordOk = await verifyPassword(
					server,
					credentials.password,
					userFound.password as string
				);
				if (!passwordOk) {
					reply
						.status(401)
						.send(unauthorizedError(`Email ou mot de passe incorrect`));
				} else {
					if (userFound.id_role !== 1 && userFound.id_role !== 2) {
						reply.status(403).send(forbiddenError(`Acces interdit`));
					} else {
						const token = createToken(server, userFound);
						reply.status(200).send(token);
					}
				}
			}
		}
	);
};

export default authRouter;
