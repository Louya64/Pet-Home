import prisma from "../database";
import { type MessageType } from "./types";

export const findAllMessages = async (
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

	return await prisma.messages.findMany({
		where: filters,
		orderBy: orderBy,
		select: {
			id: true,
			creation_date: true,
			id_adoption_request: true,
			id_author: true,
			author: {
				select: {
					username: true,
					lastname: true,
					firstname: true,
					id_role: true,
					role: {
						select: {
							name: true,
						},
					},
				},
			},
			text: true,
		},
	});
};

// export const findMessageById = async (id: number) => {
// 	return await prisma.messages.findUnique({
// 		where: {
// 			id: Number(id),
// 		},
// 	});
// };

export const createMessage = async (data: MessageType) => {
	return await prisma.messages.create({ data });
};

// export const updateMessage = async (id: number, data: MessageUpdateType) => {
// 	return await prisma.messages.update({
// 		where: {
// 			id: Number(id),
// 		},
// 		data: {
// 			...data,
// 		},
// 	});
// };

// export const deleteMessage = async (id: number) => {
// 	return await prisma.messages.delete({
// 		where: {
// 			id: Number(id),
// 		},
// 	});
// };
