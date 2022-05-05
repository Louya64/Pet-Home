import prisma from "../database";
import { PhotoType, Photo } from "./types";

export const findAllPhotos = async (filterArray: any) => {
	return await prisma.photos.findMany({
		where: filterArray[0],
	});
};

export const createPhoto = async (data: PhotoType) => {
	return await prisma.photos.create({ data });
};
