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
			id_status: string;
			id_category: string;
			animal_name: string;
			id_offer: string;
			id_race: string;
			zipcode: string;
			city: string;
			age: string;
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
				id: "asc",
			};
		}

		let filterArray: [string, string | number | Object][] = [];
		const id_status = request.query.id_status;
		const animal_name = request.query.animal_name;
		const id_category = Number(request.query.id_category);
		const id_race = Number(request.query.id_race);
		const zipcode = Number(request.query.zipcode);
		const city = request.query.city;
		const age = request.query.age;
		const idIn = request.query.idIn;
		const limit = Number(request.query.limit) || 99;
		const offset = Number(request.query.offset) || 0;

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
			const minAge = Number(age.split("-")[0]);
			const maxAge = Number(age.split("-")[1]);
			filterArray.push(["age", { gte: minAge, lte: maxAge }]);
		}
		if (idIn) {
			const idArray = idIn.split(",").map((el) => Number(el));
			filterArray.push(["id", { in: idArray }]);
		}

		const matchingOffersCount = await countMatchingOffers(filterArray);
		const allOffers = await findAllOffers(filterArray, orderBy, limit, offset);
		reply.status(200).send({ offers: allOffers, count: matchingOffersCount });
	});

	server.get("/stats", async (request, reply) => {
		const nbOffers = await countOffers();
		const nbAdopted = await countAdopted();
		const nbAdoptionRequests = await countAdoptionRequests();
		const nbOffersCreatedPerDay = await offersCreatePerDayCount();
		const nbOffersAdoptedPerDay = await offersAdoptedPerDayCount();
		const nbAdoptionRequestsPerDay = await adoptionRequestsPerDayCount();
		reply.status(200).send([
			{
				title: "Nb annonce par jour",
				sum: nbOffers,
				array: nbOffersCreatedPerDay,
			},
			{
				title: "Nb annonce par jour",
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
			preHandler: upload.array("photos", 25),
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
			preHandler: upload.array("photos", 25),
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
			const offerAlreadyHasPhotos = await findAllPhotos([
				["id_offer", offerUpdated.id],
			]);
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
		async (request, reply) => {
			const offerPhotos = await findAllPhotos([
				["id_offer", Number(request.params.id)],
			]);
			await deleteOffer(Number(request.params.id));

			offerPhotos.map((photo) => {
				unlink(`./public/assets/${photo.path}`);
			});
			reply.status(200).send(`Offre ${request.params.id} supprimée`);
		}
	);
};

export default offerRouter;
