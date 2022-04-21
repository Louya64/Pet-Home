import { FromSchema } from "json-schema-to-ts";

const ParamsId = {
	type: "object",
	properties: {
		id: { type: "number" },
	},
	required: ["id"],
} as const;
type ParamsIdType = FromSchema<typeof ParamsId>;

const Error = {
	type: "object",
	properties: {
		statusCode: { type: "number" },
		error: { type: "string" },
		message: { type: "string" },
	},
	required: ["statusCode", "error", "message"],
} as const;
type ErrorType = FromSchema<typeof Error>;

export { ParamsId, ParamsIdType, Error, ErrorType };
