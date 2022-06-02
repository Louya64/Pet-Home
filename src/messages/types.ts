import { FromSchema } from "json-schema-to-ts";

const Message = {
	type: "object",
	properties: {
		id: { type: "number" },
		id_adoption_request: { type: "number" },
		id_author: { type: ["number", "null"] },
		text: { type: "string" },
		seen: { type: "boolean" },
	},
	required: ["id_adoption_request", "text"],
} as const;
type MessageType = FromSchema<typeof Message>;

const SocketMessage = {
	type: "object",
	properties: {
		author: { type: "object" },
		text: { type: "string" },
	},
	required: ["author", "text"],
} as const;
type SocketMessageType = FromSchema<typeof SocketMessage>;

const MessageUpdate = {
	type: "object",
	properties: {
		seen: { type: "boolean" },
	},
	required: [],
} as const;
type MessageUpdateType = FromSchema<typeof MessageUpdate>;

export {
	Message,
	MessageType,
	SocketMessage,
	SocketMessageType,
	MessageUpdate,
	MessageUpdateType,
};
