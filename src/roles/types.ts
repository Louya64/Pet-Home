import { FromSchema } from "json-schema-to-ts";

const Role = {
	type: "object",
	properties: {
		id: { type: "number" },
		name: { type: "string" },
	},
	required: ["name"],
} as const;
type RoleType = FromSchema<typeof Role>;

export { Role, RoleType };
