import fastify from "fastify";
import fasityCors from "fastify-cors";
import fastifyJwt from "fastify-jwt";
import fastifyEnv from "fastify-env";
import multer from "fastify-multer";
import path from "path";
import fastifyStatic from "@fastify/static";
import fastifySocketIo from "fastify-socket.io";
import socketConnection from "./socketManager";

import roleRouter from "./roles/routes";
import userRouter from "./users/routes";
import authRouter from "./auth/routes";
import categoryRouter from "./categories/routes";
import raceRouter from "./races/routes";
import offerStatusRouter from "./offerStatus/routes";
import adoptionStatusRouter from "./adoptionStatus/routes";
import offerRouter from "./offers/routes";
import uploadsRouter from "./uploads/routes";
import adoptionRequestRouter from "./adoptionRequests/routes";
import messageRouter from "./messages/routes";

// dotenv
declare module "fastify" {
	interface FastifyInstance {
		config: {
			URL_SITE: string;
			URL_DASHBOARD: string;
			URL_BACK: string;
			SMTP_EMAIL: string;
			SMTP_HOST: string;
			SMTP_PORT: string;
			SMTP_USERNAME: string;
			SMTP_PASSWORD: string;
			PRIVATE_KEY: string;
			FACEBOOK_ID: string;
			FACEBOOK_SECRET: string;
		};
	}
}

const schema = {
	type: "object",
	required: [
		"URL_SITE",
		"URL_DASHBOARD",
		"URL_BACK",
		"SMTP_EMAIL",
		"SMTP_HOST",
		"SMTP_PORT",
		"SMTP_USERNAME",
		"SMTP_PASSWORD",
		"PRIVATE_KEY",
		"FACEBOOK_ID",
		"FACEBOOK_SECRET",
	],
	properties: {
		URL_SITE: {
			type: "string",
		},
		URL_DASHBOARD: {
			type: "string",
		},
		URL_BACK: {
			type: "string",
		},
		SMTP_EMAIL: {
			type: "string",
		},
		SMTP_HOST: {
			type: "string",
		},
		SMTP_PORT: {
			type: "string",
		},
		SMTP_USERNAME: {
			type: "string",
		},
		SMTP_PASSWORD: {
			type: "string",
		},
		PRIVATE_KEY: {
			type: "string",
		},
		FACEBOOK_ID: {
			type: "string",
		},
		FACEBOOK_SECRET: {
			type: "string",
		},
	},
};

const options = {
	dotevn: true,
	schema: schema,
};

async function createServer() {
	const server = fastify();

	await server.register(fastifyEnv, options);

	server.register(fastifyJwt, {
		secret: "secret",
	});
	server.register(fasityCors, {
		origin: "*",
	});
	// multer
	server.register(multer.contentParser);
	server.register(fastifyStatic, {
		root: path.join(__dirname.slice(0, -8), "public/assets"),
		prefix: "/image/",
	});
	server.register(fastifySocketIo, {
		cors: { origin: "http://localhost:3000" },
	});
	server.ready().then(() => {
		socketConnection.start(server.io);
	});

	server.register(roleRouter, { prefix: "/roles" });
	server.register(userRouter, { prefix: "/users" });
	server.register(authRouter);
	server.register(categoryRouter, { prefix: "/categories" });
	server.register(raceRouter, { prefix: "/races" });
	server.register(offerStatusRouter, { prefix: "/offerStatus" });
	server.register(adoptionStatusRouter, { prefix: "/adoptionStatus" });
	server.register(offerRouter, { prefix: "/offers" });
	server.register(uploadsRouter, { prefix: "/uploads" });
	server.register(adoptionRequestRouter, { prefix: "/adoptionRequests" });
	server.register(messageRouter, { prefix: "/messages" });

	server.listen(8080, (err, address) => {
		if (err) {
			process.exit(1);
		}
		console.log(`Server listening at ${address}`);
	});
	return server;
}

createServer();
