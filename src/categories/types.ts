import { FromSchema } from "json-schema-to-ts";

const Category = {
	type: "object",
	properties: {
		id: { type: "number" },
		name: { type: "string" },
		id_parent_category: { type: ["number", "null"] },
	},
	required: ["name"],
} as const;
type CategoryType = FromSchema<typeof Category>;

const CategoryUpdate = {
	type: "object",
	properties: {
		name: { type: "string" },
		id_parent_category: { type: ["number", "null"] },
	},
	required: [],
} as const;
type CategoryUpdateType = FromSchema<typeof CategoryUpdate>;

export { Category, CategoryType, CategoryUpdate, CategoryUpdateType };
