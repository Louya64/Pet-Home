import prisma from "../database";
import { type AdoptionRequestType, AdoptionRequestUpdateType } from "./types";

export const findAllAdoptionRequests = async () => {
	return await prisma.adoption_requests.findMany();
};

export const countAdoptionRequests = async () => {
	return prisma.adoption_requests.count();
};

export const adoptionRequestsPerDayCount = async () => {
	return prisma.$queryRaw`SELECT DATE_FORMAT(adoption_requests.creation_date, '%Y-%m-%d') "date", COUNT(adoption_requests.id) "count"
  FROM adoption_requests
  GROUP BY DATE_FORMAT(adoption_requests.creation_date, '%Y-%m-%d')`;
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
