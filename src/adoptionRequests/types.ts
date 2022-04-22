import { FromSchema } from "json-schema-to-ts";

const AdoptionRequest = {
	type: "object",
	properties: {
		id: { type: "number" },
		// creation_date
		id_offer: { type: "number" },
		candidate_contact: { type: "string" },
		id_candidate: { type: ["number", "null"] },
		id_adoption_status: { type: "number" },
	},
	required: ["id_offer", "candidate_contact", "id_adoption_status"],
} as const;
type AdoptionRequestType = FromSchema<typeof AdoptionRequest>;

const AdoptionRequestUpdate = {
	type: "object",
	properties: {
		candidate_contact: { type: "string" },
		id_candidate: { type: "number" },
		id_adoption_status: { type: "number" },
	},
	required: [],
} as const;
type AdoptionRequestUpdateType = FromSchema<typeof AdoptionRequestUpdate>;

export {
	AdoptionRequest,
	AdoptionRequestType,
	AdoptionRequestUpdate,
	AdoptionRequestUpdateType,
};
