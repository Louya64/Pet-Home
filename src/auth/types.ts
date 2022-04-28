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

// what is required and optionnal when a user is created from site (not with facebook)
const UserCreateFromApp = {
	type: "object",
	properties: {
		email: { type: "string" },
		password: { type: "string" },
		confirmedPassword: { type: "string" },
		username: { type: "string" },
		firstname: { type: "string" },
		lastname: { type: "string" },
		phone_number: { type: "string" },
	},
	required: ["email", "password", "confirmedPassword", "username", "firstname"],
} as const;
type UserCreateFromAppType = FromSchema<typeof UserCreateFromApp>;

// what is required and optionnal when a user is created from dashboard
const UserCreateFromDashboard = {
	type: "object",
	properties: {
		id_role: { type: "number" },
		email: { type: "string" },
		password: { type: "string" },
		confirmedPassword: { type: "string" },
		username: { type: "string" },
		firstname: { type: "string" },
		lastname: { type: "string" },
		phone_number: { type: "string" },
	},
	required: [
		"id_role",
		"email",
		"password",
		"confirmedPassword",
		"username",
		"firstname",
		"lastname",
	],
} as const;
type UserCreateFromDashboardType = FromSchema<typeof UserCreateFromDashboard>;

// what is required when login without facebook
const UserLogin = {
	type: "object",
	properties: {
		email: { type: "string" },
		password: { type: "string" },
	},
	required: ["email", "password"],
} as const;
type UserLoginType = FromSchema<typeof UserLogin>;

const Token = {
	type: "string",
} as const;
type TokenType = FromSchema<typeof Token>;

const UserEmail = {
	type: "object",
	properties: {
		email: { type: "string" },
	},
	required: ["email"],
} as const;
type UserEmailType = FromSchema<typeof UserEmail>;

export {
	UserCreate,
	UserCreateType,
	UserCreateFromApp,
	UserCreateFromAppType,
	UserCreateFromDashboard,
	UserCreateFromDashboardType,
	UserLogin,
	UserLoginType,
	Token,
	TokenType,
	UserEmail,
	UserEmailType,
};
