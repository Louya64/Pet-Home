import { FromSchema } from "json-schema-to-ts";

const OfferStatus = {
	type: "object",
	properties: {
		id: { type: "number" },
		name: { type: "string" },
	},
	required: ["name"],
} as const;
type OfferStatusType = FromSchema<typeof OfferStatus>;

export { OfferStatus, OfferStatusType };
