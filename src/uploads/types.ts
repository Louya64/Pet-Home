import { FromSchema } from "json-schema-to-ts";

const Photo = {
	type: "object",
	properties: {
		id: { type: "number" },
		id_offer: { type: "number" },
		path: { type: "string" },
		main: { type: "boolean" },
	},
	required: ["id_offer", "path", "main"],
} as const;
type PhotoType = FromSchema<typeof Photo>;

export { PhotoType, Photo };
