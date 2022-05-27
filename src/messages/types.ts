import { FromSchema } from "json-schema-to-ts";

const Message = {
	type: "object",
	properties: {
		id: { type: "number" },
		id_adoption_request: { type: "number" },
		id_author: { type: ["number", "null"] },
		text: { type: "string" },
	},
	required: ["id_adoption_request", "text"],
} as const;
type MessageType = FromSchema<typeof Message>;

export { Message, MessageType };
