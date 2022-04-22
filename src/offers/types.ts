import { FromSchema } from "json-schema-to-ts";

const Offer = {
	type: "object",
	properties: {
		id: { type: "number" },
		// creation_date
		// adoption_date
		id_status: { type: "number" },
		animal_name: { type: ["string", "null"] },
		age: { type: "number" },
		id_category: { type: "number" },
		id_race: { type: ["number", "null"] },
		zipcode: { type: "number" },
		city: { type: "string" },
		identified: { type: "boolean" },
		vaccinated: { type: "boolean" },
		disabled: { type: "boolean" },
		disability: { type: ["string", "null"] },
		description: { type: ["string", "null"] },
	},
	// creation_date
	// adoption_date
	required: [
		"id_status",
		"age",
		"id_category",
		"zipcode",
		"city",
		"identified",
		"vaccinated",
		"disabled",
	],
} as const;
type OfferType = FromSchema<typeof Offer>;

const OfferUpdate = {
	type: "object",
	properties: {
		// adoption_date
		id_status: { type: "number" },
		animal_name: { type: "string" },
		age: { type: "number" },
		id_category: { type: "number" },
		id_race: { type: "number" },
		zipcode: { type: "number" },
		city: { type: "string" },
		identified: { type: "boolean" },
		vaccinated: { type: "boolean" },
		disabled: { type: "boolean" },
		disability: { type: "string" },
		description: { type: "string" },
	},
	required: [],
} as const;
type OfferUpdateType = FromSchema<typeof OfferUpdate>;

export { Offer, OfferType, OfferUpdate, OfferUpdateType };
