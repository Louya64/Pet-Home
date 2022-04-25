import prisma from "../database";
import { type CategoryType, CategoryUpdateType } from "./types";

export const findAllCategories = async () => {
	return await prisma.categories.findMany();
};

export const findCategoryById = async (id: number) => {
	return await prisma.categories.findUnique({
		where: {
			id: Number(id),
		},
	});
};

export const findCategoryByName = async (name: string) => {
	return await prisma.categories.findUnique({
		where: {
			name: name,
		},
	});
};

export const createCategory = async (data: CategoryType) => {
	return await prisma.categories.create({ data });
};

export const updateCategory = async (id: number, data: CategoryUpdateType) => {
	return await prisma.categories.update({
		where: {
			id: Number(id),
		},
		data: {
			...data,
		},
	});
};

export const deleteCategory = async (id: number) => {
	return await prisma.categories.delete({
		where: {
			id: Number(id),
		},
	});
};
