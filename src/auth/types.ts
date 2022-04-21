import { FromSchema } from "json-schema-to-ts";

// what prisma needs
const UserCreate = {
	type: "object",
	properties: {
		id_role: { type: "number" },
		email: { type: "string" },
		password: { type: "string" },
		username: { type: "string" },
		firstname: { type: "string" },
		lastname: { type: "string" },
		phone_number: { type: "string" },
	},
	required: ["id_role", "email"],
} as const;
type UserCreateType = FromSchema<typeof UserCreate>;

// what is required and optionnal when a user is created (not with facebook)
const UserCreateFromApp = {
	type: "object",
	properties: {
		email: { type: "string" },
		password: { type: "string" },
		username: { type: "string" },
		firstname: { type: "string" },
		lastname: { type: "string" },
		phone_number: { type: "string" },
	},
	required: ["email", "password"],
} as const;
type UserCreateFromAppType = FromSchema<typeof UserCreateFromApp>;

// what is required and optionnal when an admin is created
const UserCreateAsAdmin = {
	type: "object",
	properties: {
		email: { type: "string" },
		password: { type: "string" },
		username: { type: "string" },
		firstname: { type: "string" },
		lastname: { type: "string" },
		phone_number: { type: "string" },
	},
	required: ["email", "password", "username", "firstname", "lastname"],
} as const;
type UserCreateAsAdminType = FromSchema<typeof UserCreateAsAdmin>;

export {
	UserCreate,
	UserCreateType,
	UserCreateFromApp,
	UserCreateFromAppType,
	UserCreateAsAdmin,
	UserCreateAsAdminType,
};
