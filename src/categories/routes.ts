import type { FastifyInstance, FastifyRequest } from "fastify";
import { ParamsIdType, ErrorType } from "../commons/types";
import { notFoundError, duplicateDataError } from "../commons/errorHelpers";
import {
	findAllCategories,
	findCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
	findCategoryByName,
} from "./dao";
import {
	Category,
	CategoryType,
	CategoryUpdate,
	CategoryUpdateType,
} from "./types";

const categoryRouter = async (server: FastifyInstance) => {
	server.get<{
		Querystring: FastifyRequest["Querystring"];
		Reply: CategoryType[];
	}>("/", async (request, reply) => {
		let orderBy = {};
		if (request.query.orderBy) {
			orderBy = {
				[request.query.orderBy.split("-")[0]]:
					request.query.orderBy.split("-")[1],
			};
		} else {
			orderBy = {
				id: "asc",
			};
		}

		const allCategories = await findAllCategories(orderBy);
		reply.status(200).send(allCategories);
	});

	server.get<{ Params: ParamsIdType; Reply: CategoryType | ErrorType }>(
		"/:id",
		async (request, reply) => {
			const category = await findCategoryById(Number(request.params.id));
			if (category) {
				reply.status(200).send(category);
			}
		}
	);

	server.post<{ Body: CategoryType; Reply: CategoryType | ErrorType }>(
		"/",
		{
			schema: {
				body: Category,
				response: {
					200: Category,
				},
			},
		},
		async (request, reply) => {
			const { body: category } = request;
			const categoryNameAlreadyExists = await findCategoryByName(category.name);
			if (!categoryNameAlreadyExists) {
				const categoryCreated = await createCategory(category);
				reply.status(200).send(categoryCreated);
			} else {
				reply
					.status(409)
					.send(duplicateDataError(`Cette catégorie existe déjà`));
			}
		}
	);

	server.put<{
		Params: ParamsIdType;
		Body: CategoryUpdateType;
		Reply: CategoryType | ErrorType;
	}>(
		"/:id",
		{
			schema: {
				body: CategoryUpdate,
				response: {
					200: Category,
				},
			},
		},
		async (request, reply) => {
			const { body: category } = request;
			let categoryNameAlreadyExists = false;
			if (category.name) {
				const categoryFound = await findCategoryByName(category.name);
				if (categoryFound && categoryFound.id !== category.id) {
					categoryNameAlreadyExists = true;
				}
			}
			if (!categoryNameAlreadyExists) {
				const categoryUpdated = await updateCategory(
					Number(request.params.id),
					category
				);
				reply.status(200).send(categoryUpdated);
			} else {
				reply
					.status(409)
					.send(duplicateDataError(`Cette catégorie existe déjà`));
			}
		}
	);

	server.delete<{ Params: ParamsIdType; Reply: string }>(
		"/:id",
		async (request, reply) => {
			await deleteCategory(Number(request.params.id));
			reply.status(200).send(`Catégorie ${request.params.id} supprimée`);
		}
	);
};

export default categoryRouter;
