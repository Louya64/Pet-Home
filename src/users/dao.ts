import { isDataView } from "util/types";
import prisma from "../database";
import { UserUpdateType, type UserType } from "./types";

export const findAllUsers = async () => {
	return await prisma.users.findMany();
};

export const findUserById = async (id: number) => {
	return await prisma.users.findUnique({
		where: {
			id: Number(id),
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

export const createUser = async (data: UserType) => {
	return await prisma.users.create({ data });
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
