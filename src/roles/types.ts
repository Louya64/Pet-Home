import { Static, Type } from "@sinclair/typebox";

const Role = Type.Object({
	id: Type.Optional(Type.Number()),
	name: Type.String(),
});
type RoleType = Static<typeof Role>;

export { Role, RoleType };
