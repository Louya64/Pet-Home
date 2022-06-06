import type { FastifyInstance } from "fastify";
import { ParamsIdType, ErrorType } from "../commons/types";
import { findAllMessages, createMessage, updateMessage } from "./dao";
import {
	Message,
	MessageType,
	MessageUpdate,
	MessageUpdateType,
} from "./types";

const messageRouter = async (server: FastifyInstance) => {
	interface FastifyRequest {
		Querystring: {
			idReq: number;
			orderBy: string;
			idReqIn: string;
			authorRole: string;
			seen: string;
			limit: string;
			offset: string;
		};
	}
	server.get<{
		Querystring: FastifyRequest["Querystring"];
		Reply: MessageType[];
	}>("/", async (request, reply) => {
		let orderBy = {};
		if (request.query.orderBy) {
			orderBy = {
				[request.query.orderBy.split("-")[0]]:
					request.query.orderBy.split("-")[1],
			};
		} else {
			orderBy = {
				creation_date: "desc",
			};
		}

		let filterArray: [string, string | number | Object][] = [];
		const idReq = Number(request.query.idReq);
		const idReqIn = request.query.idReqIn;
		const authorRole = request.query.authorRole;
		const seen = request.query.seen;
		const limit = Number(request.query.limit) || 99;
		const offset = Number(request.query.offset) || 0;

		if (idReq) {
			filterArray.push(["id_adoption_request", idReq]);
		}
		if (idReqIn) {
			const idReqArray = idReqIn.split(",").map((el) => Number(el));
			filterArray.push(["id_adoption_request", { in: idReqArray }]);
		}
		if (authorRole) {
			if (authorRole[0] === "!") {
				filterArray.push([
					"author",
					{ id_role: { not: Number(authorRole[1]) } },
				]);
			} else {
				filterArray.push(["author", { id_role: Number(authorRole) }]);
			}
		}
		if (seen) {
			if (seen === "true") {
				filterArray.push(["seen", true]);
			} else {
				filterArray.push(["seen", false]);
			}
		}

		const allMessages = await findAllMessages(
			filterArray,
			orderBy,
			limit,
			offset
		);
		reply.status(200).send(allMessages);
	});

	server.post<{ Body: MessageType; Reply: MessageType | ErrorType }>(
		"/",
		{
			schema: {
				body: Message,
				response: {
					200: Message,
				},
			},
		},
		async (request, reply) => {
			const { body: message } = request;
			const messageCreated = await createMessage(message);
			reply.status(200).send(messageCreated);
		}
	);

	server.put<{
		Params: ParamsIdType;
		Body: MessageUpdateType;
		Reply: MessageUpdateType | ErrorType;
	}>(
		"/:id",
		{
			schema: {
				body: MessageUpdate,
				response: {
					200: MessageUpdate,
				},
			},
		},
		async (request, reply) => {
			const { body: message } = request;
			const messageUpdated = await updateMessage(
				Number(request.params.id),
				message
			);
			reply.status(200).send(messageUpdated);
		}
	);
};

export default messageRouter;
