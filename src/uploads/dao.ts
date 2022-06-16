import prisma from "../database";
import { PhotoType, PhotoUpdateType } from "./types";

export const findAllPhotos = async (
	filterArray: [string, string | number | Object][],
	limit: number
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
	return await prisma.photos.findMany({
		take: limit,
		where: filters,
	});
};

export const createPhoto = async (data: PhotoType) => {
	return await prisma.photos.create({ data });
};

export const updatePhoto = async (id: number, data: PhotoUpdateType) => {
	return await prisma.photos.update({
		where: {
			id: Number(id),
		},
		data: {
			...data,
		},
	});
};

export const deletePhoto = async (id: number) => {
	return await prisma.photos.delete({
		where: {
			id: Number(id),
		},
	});
};
