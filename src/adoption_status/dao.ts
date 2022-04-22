import prisma from "../database";
import { type AdoptionStatusType } from "./types";

export const findAllAdoptionStatuss = async () => {
	return await prisma.adoption_status.findMany();
};

export const findAdoptionStatusById = async (id: number) => {
	return await prisma.adoption_status.findUnique({
		where: {
			id: Number(id),
		},
	});
};

export const findAdoptionStatusByName = async (name: string) => {
	return await prisma.adoption_status.findUnique({
		where: {
			name: name,
		},
	});
};

export const createAdoptionStatus = async (data: AdoptionStatusType) => {
	return await prisma.adoption_status.create({ data });
};

export const updateAdoptionStatus = async (
	id: number,
	data: AdoptionStatusType
) => {
	return await prisma.adoption_status.update({
		where: {
			id: Number(id),
		},
		data: {
			...data,
		},
	});
};

export const deleteAdoptionStatus = async (id: number) => {
	return await prisma.adoption_status.delete({
		where: {
			id: Number(id),
		},
	});
};
