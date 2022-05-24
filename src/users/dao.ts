import prisma from "../database";
import { UserUpdateType } from "./types";

export const findAllUsers = async (
	filterArray: [string, string | number | Object][],
	orderBy: Object
) => {
	const entries = new Map(filterArray);
	const obj = Object.fromEntries(entries);

	let filters = {};
	if (filterArray.length === 1) {
		filters = obj;
	} else if (filterArray.length > 1) {
		filters = {
			AND: obj,
		};
	}
	return await prisma.users.findMany({
		where: filters,
		select: {
			id: true,
			creation_date: true,
			role: {
				select: {
					name: true,
				},
			},
			id_role: true,
			email: true,
			username: true,
			firstname: true,
			lastname: true,
			phone_number: true,
		},
		orderBy: orderBy,
	});
};

export const findUserById = async (id: number) => {
	return await prisma.users.findUnique({
		where: {
			id: Number(id),
		},
		select: {
			id: true,
			creation_date: true,
			role: {
				select: {
					name: true,
				},
			},
			id_role: true,
			email: true,
			username: true,
			firstname: true,
			lastname: true,
			phone_number: true,
		},
	});
};

export const findUserByEmail = async (email: string) => {
	return await prisma.users.findUnique({
		where: {
			email: email,
		},
	});
};

export const findUserByUsername = async (username: string) => {
	return await prisma.users.findUnique({
		where: {
			username: username,
		},
	});
};

export const updateUser = async (id: number, data: UserUpdateType) => {
	return await prisma.users.update({
		where: {
			id: Number(id),
		},
		data: {
			...data,
		},
	});
};

export const deleteUser = async (id: number) => {
	return await prisma.users.delete({
		where: {
			id: Number(id),
		},
	});
};
