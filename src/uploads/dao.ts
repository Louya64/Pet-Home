import prisma from "../database";
import { PhotoType, Photo, PhotoUpdateType, PhotoUpdate } from "./types";

export const findAllPhotos = async (filterArray: any) => {
	return await prisma.photos.findMany({
		where: filterArray[0],
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
