import prisma from "../database";
import { UserCreateType } from "./types";

export const createUser = async (data: UserCreateType) => {
	return await prisma.users.create({ data });
};
