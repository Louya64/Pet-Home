import { Static, Type } from "@sinclair/typebox";

const paramsId = Type.Object({
	id: Type.Number(),
});
type paramsIdType = Static<typeof paramsId>;

export { paramsId, paramsIdType };
