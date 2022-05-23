import prisma from "../database";
import { type OfferType, OfferUpdateType } from "./types";

export const findAllOffers = async (
	filterArray: [string, string | number | Object][],
	orderBy: object
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

	return await prisma.offers.findMany({
		where: filters,
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
		orderBy: orderBy,
	});
};

export const countOffers = async () => {
	return prisma.offers.count();
};

export const countAdopted = async () => {
	return prisma.offers.count({
		where: {
			adoption_date: {
				not: null,
			},
		},
	});
};

export const offersCreatePerDayList = async () => {
	return prisma.offers.groupBy({
		by: ["city"],
		_count: {
			city: true,
		},
	});
};

export const findOfferById = async (id: number) => {
	return await prisma.offers.findUnique({
		where: {
			id: Number(id),
		},
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
			id: id,
		},
	});
};
