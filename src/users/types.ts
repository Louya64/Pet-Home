import { Static, Type, TSchema } from "@sinclair/typebox";

const Nullable = <T extends TSchema>(type: T) =>
	Type.Union([type, Type.Null()]);

const User = Type.Object({
	id: Type.Optional(Type.Number()),
	creation_date: Type.Optional(Type.Any()),
	id_role: Type.Number(),
	email: Type.String({ format: "email" }),
	password: Nullable(Type.String()),
	facebook_token: Nullable(Type.String()),
	username: Nullable(Type.String()),
	firstname: Nullable(Type.String()),
	lastname: Nullable(Type.String()),
	phone_number: Nullable(Type.String()),
});
type UserType = Static<typeof User>;

const UserUpdate = Type.Object({
	id: Type.Optional(Type.Number()),
	creation_date: Type.Optional(Type.Any()),
	id_role: Type.Optional(Type.Number()),
	email: Type.Optional(Type.String({ format: "email" })),
	password: Type.Optional(Type.String()),
	facebook_token: Type.Optional(Type.String()),
	username: Type.Optional(Type.String()),
	firstname: Type.Optional(Type.String()),
	lastname: Type.Optional(Type.String()),
	phone_number: Type.Optional(Type.String()),
});
type UserUpdateType = Static<typeof UserUpdate>;

export { User, UserType, UserUpdate, UserUpdateType };
