import type { FastifyInstance } from "fastify";
import multer from "fastify-multer";
import { File, FilesObject } from "fastify-multer/lib/interfaces";
import { ParamsIdType, ErrorType } from "../commons/types";
import {
	countMatchingOffers,
	findAllOffers,
	countOffers,
	countAdopted,
	offersCreatePerDayCount,
	offersAdoptedPerDayCount,
	findOfferById,
	createOffer,
	updateOffer,
	deleteOffer,
} from "./dao";
import {
	adoptionRequestsPerDayCount,
	countAdoptionRequests,
} from "../adoptionRequests/dao";
import { createPhoto, findAllPhotos } from "../uploads/dao";
import { OfferType, OfferReplyType, OfferFromMulterType } from "./types";
import { adminAccessOnly } from "../commons/accessMiddlewares";
import { unlink } from "node:fs/promises";

type FilesInRequest = FilesObject | Partial<File>[];

declare module "fastify" {
	interface FastifyRequest {
		file: File;
		files: FilesInRequest;
	}
}

const storage = multer.diskStorage({
	destination: function (_req, _file, cb) {
		cb(null, "./public/assets/");
	},
	filename: function (_req, file, cb) {
		cb(null, Date.now() + file.originalname);
	},
});

const upload = multer({ storage: storage });

const offerRouter = async (server: FastifyInstance) => {
	interface FastifyRequest {
		Querystring: {
			creation_date: string;
			adoption_date: string;
			id_status: string;
			id_category: string;
			animal_name: string;
			id_offer: string;
			id_race: string;
			zipcode: string;
			city: string;
			age: string;
			identified: string;
			vaccinated: string;
			disabled: string;
			search: string;
			idIn: string;
			orderBy: string;
			limit: string;
			offset: string;
		};
	}

	server.get<{
		Querystring: FastifyRequest["Querystring"];
		Reply: { offers: OfferReplyType[]; count: number };
	}>("/", async (request, reply) => {
		let orderBy = {};
		if (request.query.orderBy) {
			orderBy = {
				[request.query.orderBy.split("-")[0]]:
					request.query.orderBy.split("-")[1],
			};
		} else {
			orderBy = {
				id: "desc",
			};
		}

		let filterArray: [string, string | number | Object][] = [];
		const creation_date = request.query.creation_date;
		const adoption_date = request.query.adoption_date;
		const id_status = request.query.id_status;
		const animal_name = request.query.animal_name;
		const id_category = Number(request.query.id_category);
		const id_race = Number(request.query.id_race);
		const zipcode = Number(request.query.zipcode);
		const city = request.query.city;
		const age = request.query.age;
		const identified = request.query.identified;
		const vaccinated = request.query.vaccinated;
		const disabled = request.query.disabled;
		const search = request.query.search;
		const idIn = request.query.idIn;
		const limit = Number(request.query.limit) || 99;
		const offset = Number(request.query.offset) || 0;

		if (creation_date) {
			if (creation_date.split("-")[0] === "lessThan") {
				filterArray.push([
					"creation_date",
					{
						lt: new Date(
							`${creation_date.slice(
								creation_date.indexOf("-") + 1
							)}T00:00:00.000Z`
						),
					},
				]);
			} else if (creation_date.split("-")[0] === "equal") {
				filterArray.push([
					"creation_date",
					{
						gte: new Date(
							`${creation_date.slice(
								creation_date.indexOf("-") + 1
							)}T00:00:00.000Z`
						),
						lte: new Date(
							`${creation_date.slice(
								creation_date.indexOf("-") + 1
							)}T23:59:59.000Z`
						),
					},
				]);
			} else if (creation_date.split("-")[0] === "greaterThan") {
				filterArray.push([
					"creation_date",
					{
						gt: new Date(
							`${creation_date.slice(
								creation_date.indexOf("-") + 1
							)}T23:59:59.000Z`
						),
					},
				]);
			} else {
				filterArray.push([
					"creation_date",
					{
						gte: new Date(`${creation_date.slice(0, 10)}T00:00:00.000Z`),
						lte: new Date(`${creation_date.slice(11)}T23:59:59.000Z`),
					},
				]);
			}
		}
		if (adoption_date) {
			if (adoption_date.split("-")[0] === "lessThan") {
				filterArray.push([
					"adoption_date",
					{
						lt: new Date(
							`${adoption_date.slice(
								adoption_date.indexOf("-") + 1
							)}T00:00:00.000Z`
						),
					},
				]);
			} else if (adoption_date.split("-")[0] === "equal") {
				filterArray.push([
					"adoption_date",
					{
						gte: new Date(
							`${adoption_date.slice(
								adoption_date.indexOf("-") + 1
							)}T00:00:00.000Z`
						),
						lte: new Date(
							`${adoption_date.slice(
								adoption_date.indexOf("-") + 1
							)}T23:59:59.000Z`
						),
					},
				]);
			} else if (adoption_date.split("-")[0] === "greaterThan") {
				filterArray.push([
					"adoption_date",
					{
						gt: new Date(
							`${adoption_date.slice(
								adoption_date.indexOf("-") + 1
							)}T23:59:59.000Z`
						),
					},
				]);
			} else {
				filterArray.push([
					"adoption_date",
					{
						gte: new Date(`${adoption_date.slice(0, 10)}T00:00:00.000Z`),
						lte: new Date(`${adoption_date.slice(11)}T23:59:59.000Z`),
					},
				]);
			}
		}
		if (id_status) {
			if (id_status[0] === "!") {
				filterArray.push(["id_status", { not: Number(id_status[1]) }]);
			} else {
				filterArray.push(["id_status", Number(id_status)]);
			}
		}
		if (animal_name) {
			filterArray.push(["animal_name", animal_name]);
		}
		if (id_category) {
			filterArray.push(["id_category", id_category]);
		}
		if (id_race) {
			filterArray.push(["id_race", id_race]);
		}
		if (zipcode) {
			filterArray.push(["zipcode", zipcode]);
		}
		if (city) {
			filterArray.push(["city", city]);
		}
		if (age) {
			if (age.split("-")[0] === "lessThan") {
				filterArray.push(["age", { lt: Number(age.split("-")[1]) }]);
			} else if (age.split("-")[0] === "equal") {
				filterArray.push(["age", Number(age.split("-")[1])]);
			} else if (age.split("-")[0] === "greaterThan") {
				filterArray.push(["age", { gt: Number(age.split("-")[1]) }]);
			} else {
				const minAge = Number(age.split("-")[0]);
				const maxAge = Number(age.split("-")[1]);
				filterArray.push(["age", { gte: minAge, lte: maxAge }]);
			}
		}
		if (identified) {
			if (identified === "true") {
				filterArray.push(["identified", true]);
			} else {
				filterArray.push(["identified", false]);
			}
		}
		if (vaccinated) {
			if (vaccinated === "true") {
				filterArray.push(["vaccinated", true]);
			} else {
				filterArray.push(["vaccinated", false]);
			}
		}
		if (disabled) {
			if (disabled === "true") {
				filterArray.push(["disabled", true]);
			} else {
				filterArray.push(["disabled", false]);
			}
		}
		if (search) {
			filterArray.push([
				search.split("-")[0],
				{
					contains: search.split("-")[1],
				},
			]);
		}
		if (idIn) {
			const idArray = idIn.split(",").map((el) => Number(el));
			filterArray.push(["id", { in: idArray }]);
		}

		const matchingOffersCount = await countMatchingOffers(filterArray);
		const allOffers = await findAllOffers(filterArray, orderBy, limit, offset);
		reply.status(200).send({ offers: allOffers, count: matchingOffersCount });
	});

	server.get("/stats", async (_request, reply) => {
		const nbOffers = await countOffers();
		const nbAdopted = await countAdopted();
		const nbAdoptionRequests = await countAdoptionRequests();
		const nbOffersCreatedPerDay = await offersCreatePerDayCount();
		const nbOffersAdoptedPerDay = await offersAdoptedPerDayCount();
		const nbAdoptionRequestsPerDay = await adoptionRequestsPerDayCount();
		reply.status(200).send([
			{
				title: "Nb annonces par jour",
				sum: nbOffers,
				array: nbOffersCreatedPerDay,
			},
			{
				title: "Nb d'adoptions par jour",
				sum: nbAdopted,
				array: nbOffersAdoptedPerDay,
			},
			{
				title: "Nb demandes d'adoption par jour",
				sum: nbAdoptionRequests,
				array: nbAdoptionRequestsPerDay,
			},
		]);
	});

	server.get<{ Params: ParamsIdType; Reply: OfferType | ErrorType }>(
		"/:id",
		async (request, reply) => {
			const offer = await findOfferById(Number(request.params.id));
			if (offer) {
				reply.status(200).send(offer);
			}
		}
	);

	server.post<{ Body: OfferFromMulterType; Reply: string | ErrorType }>(
		"/",
		{
			preHandler: [adminAccessOnly, upload.array("photos", 25)],
		},
		async (request, reply) => {
			const { body: offer } = request;
			const offerToCreate: OfferType = {
				animal_name: offer.animal_name,
				age: Number(offer.age),
				id_category: Number(offer.id_category),
				id_race: offer.id_race === "null" ? null : Number(offer.id_race),
				zipcode: Number(offer.zipcode),
				city: offer.city,
				identified: offer.identified === "true" ? true : false,
				vaccinated: offer.vaccinated === "true" ? true : false,
				disabled: offer.disabled === "true" ? true : false,
				disability: offer.disability,
				description: offer.description,
				id_status: Number(offer.id_status),
			};
			const offerCreated = await createOffer(offerToCreate);
			const photos = request.files as Partial<File>[];
			photos.map(async (photo: Partial<File>, index) => {
				let main = false;
				if (index === 0) {
					main = true;
				}
				if (photo.filename) {
					await createPhoto({
						id_offer: offerCreated.id,
						path: photo.filename,
						main: main,
					});
				}
			});
			reply.status(201).send("ok");
		}
	);

	server.put<{
		Params: ParamsIdType;
		Body: OfferFromMulterType;
		Reply: string | ErrorType;
	}>(
		"/:id",
		{
			preHandler: [adminAccessOnly, upload.array("photos", 25)],
		},
		async (request, reply) => {
			const { body: offer } = request;
			const offerToUpdate = {
				adoption_date: offer.adoption_date !== undefined ? new Date() : null,
				id_status: Number(offer.id_status),
				animal_name: offer.animal_name,
				age: Number(offer.age),
				id_category: Number(offer.id_category),
				id_race: offer.id_race === "null" ? null : Number(offer.id_race),
				zipcode: Number(offer.zipcode),
				city: offer.city,
				identified: offer.identified === "true" ? true : false,
				vaccinated: offer.vaccinated === "true" ? true : false,
				disabled: offer.disabled === "true" ? true : false,
				disability: offer.disability,
				description: offer.description,
			};
			const offerUpdated = await updateOffer(
				Number(request.params.id),
				offerToUpdate
			);
			const photos = request.files as Partial<File>[];
			const offerAlreadyHasPhotos = await findAllPhotos(
				[["id_offer", offerUpdated.id]],
				25
			);
			photos.map(async (photo: Partial<File>, index) => {
				let main = false;
				if (index === 0 && !offerAlreadyHasPhotos.length) {
					main = true;
				}
				if (photo.filename) {
					await createPhoto({
						id_offer: offerUpdated.id,
						path: photo.filename,
						main: main,
					});
				}
			});
			reply.status(200).send("ok");
		}
	);

	server.delete<{ Params: ParamsIdType; Reply: string }>(
		"/:id",
		{ preHandler: [adminAccessOnly] },
		async (request, reply) => {
			const offerPhotos = await findAllPhotos(
				[["id_offer", Number(request.params.id)]],
				25
			);
			await deleteOffer(Number(request.params.id));

			offerPhotos.map((photo) => {
				unlink(`./public/assets/${photo.path}`);
			});
			reply.status(200).send(`Offre ${request.params.id} supprimée`);
		}
	);
};

export default offerRouter;
