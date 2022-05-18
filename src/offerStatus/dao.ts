import prisma from "../database";
import { type OfferStatusType } from "./types";

export const findAllOfferStatus = async () => {
	return await prisma.offer_status.findMany();
};

export const findOfferStatusById = async (id: number) => {
	return await prisma.offer_status.findUnique({
		where: {
			id: Number(id),
		},
	});
};

export const findOfferStatusByName = async (name: string) => {
	return await prisma.offer_status.findUnique({
		where: {
			name: name,
		},
	});
};

export const createOfferStatus = async (data: OfferStatusType) => {
	return await prisma.offer_status.create({ data });
};

export const updateOfferStatus = async (id: number, data: OfferStatusType) => {
	return await prisma.offer_status.update({
		where: {
			id: Number(id),
		},
		data: {
			...data,
		},
	});
};

export const deleteOfferStatus = async (id: number) => {
	return await prisma.offer_status.delete({
		where: {
			id: Number(id),
		},
	});
};
