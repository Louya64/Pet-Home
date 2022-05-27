import type { FastifyInstance } from "fastify";
import { ParamsIdType, ErrorType } from "../commons/types";
import { duplicateDataError } from "../commons/errorHelpers";
import { findAllMessages, createMessage } from "./dao";
import { Message, MessageType } from "./types";

const messageRouter = async (server: FastifyInstance) => {
	interface FastifyRequest {
		Querystring: {
			idReq: number;
			orderBy: string;
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

		if (idReq) {
			filterArray.push(["id_adoption_request", idReq]);
		}

		const allMessages = await findAllMessages(filterArray, orderBy);
		reply.status(200).send(allMessages);
	});

	// server.get<{ Params: ParamsIdType; Reply: MessageType | ErrorType }>(
	// 	"/:id",
	// 	async (request, reply) => {
	// 		const message = await findMessageById(Number(request.params.id));
	// 		if (message) {
	// 			reply.status(200).send(message);
	// 		}
	// 	}
	// );

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

	// server.put<{
	// 	Params: ParamsIdType;
	// 	Body: MessageUpdateType;
	// 	Reply: MessageType | ErrorType;
	// }>(
	// 	"/:id",
	// 	{
	// 		schema: {
	// 			body: MessageUpdate,
	// 			response: {
	// 				200: Message,
	// 			},
	// 		},
	// 	},
	// 	async (request, reply) => {
	// 		const { body: message } = request;
	// 		const messageUpdated = await updateMessage(
	// 			Number(request.params.id),
	// 			message
	// 		);
	// 		reply.status(200).send(messageUpdated);
	// 	}
	// );

	// server.delete<{ Params: ParamsIdType; Reply: string }>(
	// 	"/:id",
	// 	async (request, reply) => {
	// 		await deleteMessage(Number(request.params.id));
	// 		reply.status(200).send(`Message ${request.params.id} supprimée`);
	// 	}
	// );
};

export default messageRouter;
