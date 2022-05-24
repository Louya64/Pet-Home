import type { FastifyInstance } from "fastify";
import { ErrorType } from "../commons/types";
import {
	duplicateDataError,
	unauthorizedError,
	forbiddenError,
	invalidDataError,
} from "../commons/errorHelpers";
import { findUserByEmail, findUserByUsername } from "../users/dao";
import { createUser } from "./dao";
import {
	UserCreateType,
	UserCreateFromApp,
	UserCreateFromAppType,
	UserCreateFromDashboard,
	UserCreateFromDashboardType,
	UserLogin,
	UserLoginType,
	Token,
	TokenType,
	UserEmailType,
} from "./types";
import bcrypt from "fastify-bcrypt";
// @ts-ignore
import nodemailer from "fastify-mailer";
import { Transporter } from "nodemailer";
import {
	hashPassword,
	verifyPassword,
	createToken,
	checkPasswordFormat,
} from "./helpers";
import { userCreateValidateData } from "./middlewares";
import { SentMessageInfo } from "nodemailer/lib/sendmail-transport";

export interface FastifyMailerNamedInstance {
	[namespace: string]: Transporter;
}
export type FastifyMailer = FastifyMailerNamedInstance & Transporter;

declare module "fastify" {
	interface FastifyInstance {
		mailer: FastifyMailer;
	}
}

const authRouter = async (server: FastifyInstance) => {
	server.register(bcrypt);
	server.register(nodemailer, {
		transport: {
			host: server.config.SMTP_HOST,
			port: server.config.SMTP_PORT,
			auth: {
				user: server.config.SMTP_USERNAME,
				pass: server.config.SMTP_PASSWORD,
			},
		},
	});

	// register from site (role auto = utilisateur)
	server.post<{ Body: UserCreateFromAppType; Reply: TokenType | ErrorType }>(
		"/auth/register",
		{
			schema: {
				body: UserCreateFromApp,
				response: {
					201: Token,
				},
			},
			preHandler: [userCreateValidateData],
		},
		async (request, reply) => {
			const { body: user } = request;

			const hashedPassword = await hashPassword(server, user.password);
			const userToCreate: UserCreateType = {
				id_role: 3,
				email: user.email,
				password: hashedPassword,
				username: user.username,
				firstname: user.firstname,
				lastname: user.lastname,
				phone_number: user.phone_number,
			};
			const userCreated = await createUser(userToCreate);
			const token = createToken(server, userCreated);
			reply.status(201).send(token);
		}
	);

	// create a user (admin) from dashboard
	server.post<{ Body: UserCreateFromDashboardType; Reply: string | ErrorType }>(
		"/dashboard/auth/register",
		{
			schema: {
				body: UserCreateFromDashboard,
			},
			preHandler: [userCreateValidateData],
		},
		async (request, reply) => {
			const { body: user } = request;

			const hashedPassword = await hashPassword(server, user.password);
			const userToCreate: UserCreateType = {
				id_role: user.id_role,
				email: user.email,
				password: hashedPassword,
				username: user.username,
				firstname: user.firstname,
				lastname: user.lastname,
				phone_number: user.phone_number,
			};
			const userCreated = await createUser(userToCreate);
			if (userCreated) {
				const { mailer } = server;
				mailer.sendMail(
					{
						from: server.config.SMTP_EMAIL,
						to: userCreated.email,
						subject: "Pet'Home - Votre compte est crée",
						text: `Votre mot de passe est : "${user.password}". Vous pouvez vous connecter à votre profil afin de le modifier`,
					},
					(err: Error | null, info: SentMessageInfo) => {
						if (err) {
							console.log(err);
						} else {
							console.log(info);
						}
					}
				);
			}
			reply
				.status(201)
				.send(`L'utilisateur ${userCreated.id} a bien été enregistré`);
		}
	);

	// login with email / password
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

	// forgot password
	server.post<{ Body: UserEmailType }>(
		"/forgotPassword",
		async (request, reply) => {
			const userFound = await findUserByEmail(request.body.email);
			if (!userFound) {
				reply.status(200).send("mail envoyé");
			} else {
				const token = createToken(server, userFound);
				const { mailer } = server;
				mailer.sendMail(
					{
						from: server.config.SMTP_EMAIL,
						to: userFound.email,
						subject: "Pet'Home - Mot de pass oublié",
						text: "cliquez sur le lien",
						html: `<a href=${server.config.URL_SITE}/changePassword?&token=${token}>lien pour changer le mot de passe</a>`,
					},
					(err: Error | null, info: SentMessageInfo) => {
						if (err) {
							console.log(err);
						} else {
							console.log(info);
						}
					}
				);
				reply.status(200).send("mail envoyé");
			}
		}
	);
};

export default authRouter;
