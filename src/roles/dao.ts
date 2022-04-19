import prisma from "../database";
import { type RoleType } from "./types";

export const findAllRoles = async () => {
	return await prisma.roles.findMany();
};

export const findRoleById = async (id: number) => {
	return await prisma.roles.findUnique({
		where: {
			id: Number(id),
		},
	});
};

// export const findRoleByName = async (name: string) => {
// 	return await prisma.roles.findUnique({
// 		where: {
//       name: name,
//     }
// 	});
// };

export const createRole = async (data: RoleType) => {
	return await prisma.roles.create({ data });
};

export const updateRole = async (id: number, data: RoleType) => {
	return await prisma.roles.update({
		where: {
			id: Number(id),
		},
		data: {
			...data,
		},
	});
};

export const deleteRole = async (id: number) => {
	return await prisma.roles.delete({
		where: {
			id: Number(id),
		},
	});
};
