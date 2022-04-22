import prisma from "../database";
import { type RaceType, RaceUpdateType } from "./types";

export const findAllRaces = async () => {
	return await prisma.races.findMany();
};

export const findRaceById = async (id: number) => {
	return await prisma.races.findUnique({
		where: {
			id: Number(id),
		},
	});
};

export const findRaceByName = async (name: string) => {
	return await prisma.races.findUnique({
		where: {
			name: name,
		},
	});
};

export const createRace = async (data: RaceType) => {
	return await prisma.races.create({ data });
};

export const updateRace = async (id: number, data: RaceUpdateType) => {
	return await prisma.races.update({
		where: {
			id: Number(id),
		},
		data: {
			...data,
		},
	});
};

export const deleteRace = async (id: number) => {
	return await prisma.races.delete({
		where: {
			id: Number(id),
		},
	});
};
