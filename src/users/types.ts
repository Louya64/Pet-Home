import { FromSchema } from "json-schema-to-ts";

const User = {
	type: "object",
	properties: {
		id: { type: "number" },
		id_role: { type: "number" },
		email: { type: "string" },
		username: { type: ["string", "null"] },
		firstname: { type: ["string", "null"] },
		lastname: { type: ["string", "null"] },
		phone_number: { type: ["string", "null"] },
	},
	required: [
		"id",
		"id_role",
		"email",
		"username",
		"firstname",
		"lastname",
		"phone_number",
	],
} as const;
type UserType = FromSchema<typeof User>;

const UserUpdate = {
	type: "object",
	properties: {
		id_role: { type: "number" },
		email: { type: "string" },
		password: { type: "string" },
		confirmedPassword: { type: "string" },
		facebook_token: { type: "string" },
		username: { type: "string" },
		firstname: { type: "string" },
		lastname: { type: "string" },
		phone_number: { type: "string" },
	},
	required: [],
} as const;
type UserUpdateType = FromSchema<typeof UserUpdate>;

export { User, UserType, UserUpdate, UserUpdateType };
