import prisma from "../database";
import { type AdoptionRequestType, AdoptionRequestUpdateType } from "./types";

export const findAllAdoptionRequests = async () => {
	return await prisma.adoption_requests.findMany();
};

// export const avgDailyAdoptionRequests = async () => {
// 	return await prisma.adoption_requests.aggregate({
// 		???
// 	});
// };

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
