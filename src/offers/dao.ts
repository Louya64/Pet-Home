import prisma from "../database";
import { type OfferType, OfferUpdateType } from "./types";

export const findAllOffers = async () => {
	return await prisma.offers.findMany({
		select: {
			id: true,
			creation_date: true,
			adoption_date: true,
			status: {
				select: {
					name: true,
				},
			},
			id_status: true,
			animal_name: true,
			age: true,
			category: {
				select: {
					name: true,
				},
			},
			id_category: true,
			race: {
				select: {
					name: true,
				},
			},
			id_race: true,
			zipcode: true,
			city: true,
			identified: true,
			vaccinated: true,
			disabled: true,
			disability: true,
			description: true,
		},
	});
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
