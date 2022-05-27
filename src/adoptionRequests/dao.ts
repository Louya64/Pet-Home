import prisma from "../database";
import { type AdoptionRequestType, AdoptionRequestUpdateType } from "./types";

export const findAllAdoptionRequests = async (
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

	return await prisma.adoption_requests.findMany({
		where: filters,
		orderBy: orderBy,
		select: {
			id: true,
			creation_date: true,
			id_offer: true,
			candidate_email: true,
			candidate_phone: true,
			id_candidate: true,
			id_adoption_status: true,
			status: {
				select: {
					name: true,
				},
			},
		},
	});
};

export const findAdoptionRequestById = async (id: number) => {
	return await prisma.adoption_requests.findUnique({
		where: {
			id: Number(id),
		},
	});
};

export const createAdoptionRequest = async (data: AdoptionRequestType) => {
	return await prisma.adoption_requests.create({ data });
};

export const updateAdoptionRequest = async (
	id: number,
	data: AdoptionRequestUpdateType
) => {
	return await prisma.adoption_requests.update({
		where: {
			id: Number(id),
		},
		data: {
			...data,
		},
	});
};

export const deleteAdoptionRequest = async (id: number) => {
	return await prisma.adoption_requests.delete({
		where: {
			id: Number(id),
		},
	});
};
