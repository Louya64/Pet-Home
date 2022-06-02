import { FromSchema } from "json-schema-to-ts";

const Offer = {
	type: "object",
	properties: {
		id: { type: "number" },
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

const OfferFromMulter = {
	type: "object",
	properties: {
		id: { type: "string" },
		id_status: { type: "string" },
		animal_name: { type: ["string", "null"] },
		age: { type: "string" },
		id_category: { type: "string" },
		id_race: { type: ["string", "null"] },
		zipcode: { type: "string" },
		city: { type: "string" },
		identified: { type: "string" },
		vaccinated: { type: "string" },
		disabled: { type: "string" },
		disability: { type: ["string", "null"] },
		description: { type: ["string", "null"] },
	},
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
type OfferFromMulterType = FromSchema<typeof OfferFromMulter>;

const OfferReply = {
	type: "object",
	properties: {
		id: { type: "number" },
		status: {
			type: "object",
			properties: {
				name: { type: "string" },
			},
		},
		animal_name: { type: ["string", "null"] },
		age: { type: "number" },
		category: {
			type: "object",
			properties: {
				name: { type: "string" },
			},
		},
		race: {
			type: ["object", "null"],
		},
		zipcode: { type: "number" },
		city: { type: "string" },
		identified: { type: "boolean" },
		vaccinated: { type: "boolean" },
		disabled: { type: "boolean" },
		disability: { type: ["string", "null"] },
		description: { type: ["string", "null"] },
	},
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
type OfferReplyType = FromSchema<typeof OfferReply>;

const OfferUpdate = {
	type: "object",
	properties: {
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
	required: [],
} as const;
type OfferUpdateType = FromSchema<typeof OfferUpdate>;

export {
	Offer,
	OfferType,
	OfferUpdate,
	OfferUpdateType,
	OfferReply,
	OfferReplyType,
	OfferFromMulter,
	OfferFromMulterType,
};
