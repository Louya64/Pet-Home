import prisma from "../database";
import { type OfferType, OfferUpdateType } from "./types";

export const findAllOffers = async () => {
	return await prisma.offers.findMany();
};

export const findOfferById = async (id: number) => {
	return await prisma.offers.findUnique({
		where: {
			id: Number(id),
		},
	});
};

export const createOffer = async (data: OfferType) => {
	return await prisma.offers.create({ data });
};

export const updateOffer = async (id: number, data: OfferUpdateType) => {
	return await prisma.offers.update({
		where: {
			id: Number(id),
		},
		data: {
			...data,
		},
	});
};

export const deleteOffer = async (id: number) => {
	return await prisma.offers.delete({
		where: {
			id: Number(id),
		},
	});
};
