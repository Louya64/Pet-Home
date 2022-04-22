import { FromSchema } from "json-schema-to-ts";

const Race = {
	type: "object",
	properties: {
		id: { type: "number" },
		id_category: { type: "number" },
		name: { type: "string" },
	},
	required: ["id_category", "name"],
} as const;
type RaceType = FromSchema<typeof Race>;

const RaceUpdate = {
	type: "object",
	properties: {
		id_category: { type: "number" },
		name: { type: "string" },
	},
	required: [],
} as const;
type RaceUpdateType = FromSchema<typeof RaceUpdate>;

export { Race, RaceType, RaceUpdate, RaceUpdateType };
