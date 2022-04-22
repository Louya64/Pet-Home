import { FromSchema } from "json-schema-to-ts";

const AdoptionStatus = {
	type: "object",
	properties: {
		id: { type: "number" },
		name: { type: "string" },
	},
	required: ["name"],
} as const;
type AdoptionStatusType = FromSchema<typeof AdoptionStatus>;

export { AdoptionStatus, AdoptionStatusType };
