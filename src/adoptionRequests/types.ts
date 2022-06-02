import { FromSchema } from "json-schema-to-ts";

const AdoptionRequest = {
	type: "object",
	properties: {
		id: { type: "number" },
		id_offer: { type: "number" },
		candidate_email: { type: "string" },
		candidate_phone: { type: ["string", "null"] },
		id_candidate: { type: ["number", "null"] },
		id_adoption_status: { type: "number" },
	},
	required: ["id_offer", "candidate_email", "id_adoption_status"],
} as const;
type AdoptionRequestType = FromSchema<typeof AdoptionRequest>;

const AdoptionRequestCreate = {
	type: "object",
	properties: {
		id: { type: "number" },
		id_offer: { type: "number" },
		candidate_email: { type: "string" },
		candidate_phone: { type: ["string", "null"] },
		id_candidate: { type: ["number", "null"] },
		id_adoption_status: { type: "number" },
		message: { type: "string" },
	},
	required: ["id_offer", "candidate_email", "id_adoption_status", "message"],
} as const;
type AdoptionRequestCreateType = FromSchema<typeof AdoptionRequestCreate>;

const AdoptionRequestUpdate = {
	type: "object",
	properties: {
		candidate_email: { type: "string" },
		candidate_phone: { type: ["string", "null"] },
		id_candidate: { type: "number" },
		id_adoption_status: { type: "number" },
	},
	required: [],
} as const;
type AdoptionRequestUpdateType = FromSchema<typeof AdoptionRequestUpdate>;

export {
	AdoptionRequest,
	AdoptionRequestType,
	AdoptionRequestCreate,
	AdoptionRequestCreateType,
	AdoptionRequestUpdate,
	AdoptionRequestUpdateType,
};
