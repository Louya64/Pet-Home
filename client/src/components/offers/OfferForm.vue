<template>
	<form
		class="form"
		enctype="multipart/form-data"
		@submit.prevent="
			submit({
				animal_name,
				age,
				id_category,
				id_race,
				zipcode,
				city,
				identified,
				vaccinated,
				disabled,
				disability,
				description,
				id_status,
			})
		"
	>
		<div class="w-1/4 px-10 mx-auto" v-if="id_status">
			<div class="form-item" v-if="offerStatusList">
				<label for="id_status">Changer le statut</label>
				<select
					required
					class="form-item-input"
					id="id_status"
					v-model="id_status"
				>
					<option
						v-for="offerStatus in offerStatusList"
						:value="offerStatus.id"
					>
						{{ offerStatus.name }}
					</option>
				</select>
			</div>
		</div>
		<div class="flex">
			<div class="w-1/2 p-10">
				<div class="form-item">
					<label for="animal_name">Nom de l'animal</label>
					<input
						class="form-item-input"
						type="text"
						id="animal_name"
						v-model="animal_name"
					/>
				</div>
				<div class="form-item">
					<label for="age"
						><font-awesome-icon class="text-red-500 text-xs" icon="asterisk" />
						Age (en mois)</label
					>
					<select class="form-item-input" id="age" v-model="age" required>
						<option value="0">Sélectionnez un age</option>
						<option value="1">1 mois</option>
						<option value="2">2 mois</option>
						<option value="3">3 mois</option>
						<option value="4">4 mois</option>
						<option value="5">5 mois</option>
						<option value="6">6 mois</option>
						<option value="7">7 mois</option>
						<option value="8">8 mois</option>
						<option value="9">9 mois</option>
						<option value="10">10 mois</option>
						<option value="11">11 mois</option>
						<option value="12">12 mois (1an)</option>
						<option value="13">13 mois</option>
						<option value="14">14 mois</option>
						<option value="15">15 mois</option>
						<option value="16">16 mois</option>
						<option value="17">17 mois</option>
						<option value="18">18 mois</option>
						<option value="19">19 mois</option>
						<option value="20">20 mois</option>
						<option value="21">21 mois</option>
						<option value="22">22 mois</option>
						<option value="23">23 mois</option>
						<option value="24">24 mois (2ans)</option>
						<option value="36">3 ans</option>
						<option value="48">4 ans</option>
						<option value="60">5 ans</option>
						<option value="72">6 ans</option>
						<option value="84">7 ans</option>
						<option value="96">8 ans</option>
						<option value="108">9 ans</option>
						<option value="120">10 ans</option>
						<option value="132">11 ans</option>
						<option value="144">12 ans</option>
						<option value="156">13 ans</option>
						<option value="168">14 ans</option>
						<option value="180">15 ans</option>
						<option value="192">16 ans</option>
						<option value="204">17 ans</option>
						<option value="216">18 ans</option>
						<option value="228">19 ans</option>
						<option value="240">20 ans</option>
					</select>
				</div>

				<div class="form-item flex-row items-center h-[86px]">
					<font-awesome-icon
						class="text-red-500 text-xs mr-2"
						icon="asterisk"
					/>
					<Switch
						v-model:checked="identified"
						:label="identified ? ' identifié' : ' non identifié'"
						@switchChange="(checked) => (identified = checked)"
					/>
				</div>
				<div class="form-item flex-row items-center h-[86px]">
					<font-awesome-icon
						class="text-red-500 text-xs mr-2"
						icon="asterisk"
					/>
					<Switch
						v-model:checked="vaccinated"
						:label="vaccinated ? ' vacciné' : ' non vacciné'"
						@switchChange="(checked) => (vaccinated = checked)"
					/>
				</div>
				<div class="form-item flex-row items-center h-[86px]">
					<font-awesome-icon
						class="text-red-500 text-xs mr-2"
						icon="asterisk"
					/>
					<Switch
						v-model:checked="disabled"
						:label="disabled ? ' handicapé' : ' pas de handicap'"
						@switchChange="(checked) => (disabled = checked)"
					/>
				</div>
			</div>

			<div class="w-1/2 p-10">
				<div class="form-item" v-if="categoriesList">
					<label for="category"
						><font-awesome-icon class="text-red-500 text-xs" icon="asterisk" />
						Espèce</label
					>
					<select
						required
						v-on:change="resetRace"
						class="form-item-input"
						id="category"
						v-model="id_category"
					>
						<option value="0">Sélectionnez une espèce</option>
						<option v-for="categorie in categoriesList" :value="categorie.id">
							{{ categorie.name }}
						</option>
					</select>
				</div>

				<div class="form-item">
					<label for="race">Race</label>
					<select class="form-item-input" id="race" v-model="id_race">
						<option value="null">Sélectionnez une race</option>
						<option v-for="race in racesList" :value="race.id">
							{{ race.name }}
						</option>
					</select>
				</div>
				<div class="form-item">
					<label for="zipcode"
						><font-awesome-icon class="text-red-500 text-xs" icon="asterisk" />
						Code postal</label
					>
					<input
						required
						class="form-item-input"
						type="number"
						id="zipcode"
						v-model="zipcode"
					/>
				</div>
				<div class="form-item">
					<label for="city"
						><font-awesome-icon class="text-red-500 text-xs" icon="asterisk" />
						Ville</label
					>
					<input
						required
						class="form-item-input"
						type="text"
						id="city"
						v-model="city"
					/>
				</div>
				<div v-if="disabled" class="form-item">
					<label for="disability"
						><font-awesome-icon class="text-red-500 text-xs" icon="asterisk" />
						Nommer ou décrire rapidement le handicap</label
					>
					<input
						required
						class="form-item-input"
						type="text"
						id="disability"
						v-model="disability"
					/>
				</div>
			</div>
		</div>

		<div class="form-item">
			<label for="description">Description</label>
			<textarea
				v-model="description"
				name="description"
				id="description"
				cols="30"
				rows="10"
			></textarea>
		</div>

		<div v-if="photosDisplayed" class="overflow-hidden relative px-10">
			<div class="flex h-[150px]">
				<div
					v-for="photo in photosDisplayed"
					class="max-w-[250px] flex justify-center items-center p-5 relative"
					:class="[photo.main ? 'border-amber-300 border-8' : '']"
					@click="updateMainPhoto(photo.id)"
				>
					<img
						class="hover:cursor-pointer hover:scale-105"
						width="250"
						:src="`${urlBack}/image/${photo.path}`"
						:alt="props.offer.category.name"
						title="Choisir comme photo principale"
					/>
					<font-awesome-icon
						class="mt-1 bg-red-500/75 rounded-full px-1 hover:cursor-pointer absolute right-2 top-2 text-white text-sm"
						icon="xmark"
						@click="deletePhoto(photo.id)"
						title="Supprimer la photo"
					/>
				</div>
			</div>
			<font-awesome-icon
				class="mt-1 bg-slate-500/75 rounded-full py-3 px-4 hover:cursor-pointer absolute right-0 top-[50px] text-white text-2xl"
				icon="chevron-right"
				@click="scrollPhotos(1)"
			/>
			<font-awesome-icon
				class="mt-1 bg-slate-500/75 rounded-full py-3 px-4 hover:cursor-pointer absolute left-0 top-[50px] text-white text-2xl"
				icon="chevron-left"
				@click="scrollPhotos(-1)"
			/>
		</div>

		<div class="form-item">
			<label for="images">Ajouter des photos</label>
			<input
				multiple
				v-on:change="(e) => updateImages(e)"
				class="form-item-input"
				type="file"
				id="images"
			/>
		</div>
		<div class="pb-10 text-center" id="requestResult"></div>
		<div class="flex justify-end">
			<button class="btn btn-green">Enregistrer</button>
		</div>
	</form>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from "vue";
import axios from "axios";
import Switch from "./Switch.vue";

interface Props {
	offer: IOfferUpdate;
	photos: IPhoto[];
}
interface IOffer {
	id_status: number;
	animal_name: string;
	age: number;
	id_category: number;
	id_race: number | null;
	zipcode: number;
	city: string;
	identified: boolean;
	vaccinated: boolean;
	disabled: boolean;
	disability: string;
	description: string;
}
interface IOfferUpdate {
	id: number;
	creation_date: string;
	adoption_date: string | null;
	id_status: number;
	status: {
		name: string;
	};
	animal_name: string;
	age: number;
	id_category: number;
	category: {
		name: string;
	};
	id_race: number | null;
	race: {
		name: string;
	} | null;
	zipcode: number;
	city: string;
	identified: boolean;
	vaccinated: boolean;
	disabled: boolean;
	disability: string;
	description: string;
}
interface ICategory {
	id: number;
	name: string;
	id_parent_category: number | null;
}
interface IRace {
	id: number;
	name: string;
	id_category: number;
}
interface IOfferStatus {
	id: number;
	name: string;
}
interface IPhoto {
	id: number;
	id_offer: number;
	main: boolean;
	path: string;
}

const emit = defineEmits<{
	(e: "updatePhotos"): void;
}>();

const urlBack = import.meta.env.VITE_URL_BACK;
const props = defineProps<Props>();
let categoriesList: Ref<ICategory[]> = ref([]);
let racesList: Ref<IRace[]> = ref([]);
let offerStatusList: Ref<IOfferStatus[]> = ref([]);
const animal_name = ref("");
const age = ref(0);
const id_category = ref(0);
const id_race: Ref<null | number> = ref(null);
const zipcode = ref(0);
const city = ref("");
const identified = ref(false);
const vaccinated = ref(false);
const disabled = ref(false);
const disability = ref("");
const description = ref("");
let requestResult = document.getElementById("requestResult");
const images = ref();
const photos = ref();
const photosDisplayed = ref();
const id_status = ref();
let firstPhotoIndex = 0;
let mainPhotoId: null | number = null;

if (props.offer) {
	animal_name.value = props.offer.animal_name;
	age.value = props.offer.age;
	id_category.value = props.offer.id_category;
	id_race.value = props.offer.id_race;
	zipcode.value = props.offer.zipcode;
	city.value = props.offer.city;
	identified.value = props.offer.identified;
	vaccinated.value = props.offer.vaccinated;
	disabled.value = props.offer.disabled;
	disability.value = props.offer.disability;
	description.value = props.offer.description;
	photos.value = props.photos;
	photosDisplayed.value = photos.value.slice(
		firstPhotoIndex,
		firstPhotoIndex + 6
	);
	id_status.value = props.offer.id_status;
	mainPhotoId = photos.value.filter((photo: IPhoto) => photo.main)[0].id;
}

const scrollPhotos = (nb: number) => {
	if (
		firstPhotoIndex + nb + 6 > photos.value.length ||
		firstPhotoIndex + nb < 0
	) {
		return;
	}
	firstPhotoIndex += nb;
	photosDisplayed.value = photos.value.slice(
		firstPhotoIndex,
		firstPhotoIndex + 6
	);
};

const updatePhoto = async (id: number, main: boolean) => {
	await axios
		.request({
			method: "put",
			url: `${import.meta.env.VITE_URL_BACK}/uploads/${id}`,
			data: { main: main },
		})
		.then((res) => {});
};

const updateMainPhoto = async (id: number) => {
	if (mainPhotoId) {
		await updatePhoto(mainPhotoId, false);
	}
	await updatePhoto(id, true);
	emit("updatePhotos");
};

const deletePhoto = (id: number) => {
	axios
		.delete(`${import.meta.env.VITE_URL_BACK}/uploads/${id}`)
		.then(() => {
			if (requestResult) {
				requestResult?.classList.add("text-green-400");
				requestResult?.classList.remove("text-red-400");
				requestResult.textContent = "La photo a bien été supprimée";
			}
		})
		.catch((err) => {
			if (requestResult) {
				requestResult?.classList.remove("text-green-400");
				requestResult?.classList.add("text-red-400");
				requestResult.textContent = err.response.data.message;
			}
		});

	photos.value = photos.value.filter((photo: IPhoto) => photo.id !== id);
	scrollPhotos(0);
};

onMounted(() => {
	requestResult = document.getElementById("requestResult");

	axios.get(`${import.meta.env.VITE_URL_BACK}/categories`).then((res) => {
		categoriesList.value = res.data;
	});

	axios.get(`${import.meta.env.VITE_URL_BACK}/races`).then((res) => {
		racesList.value = res.data;
	});

	if (props.offer) {
		axios.get(`${import.meta.env.VITE_URL_BACK}/offerStatus`).then((res) => {
			offerStatusList.value = res.data;
		});
	}
});

watch(id_category, (newVal) => {
	if (requestResult) {
		requestResult.textContent = "";
	}
	if (newVal) {
		axios
			.get(`${import.meta.env.VITE_URL_BACK}/races?id_category=${newVal}`)
			.then((res) => {
				racesList.value = res.data;
			});
	}
});

watch(id_race, (newVal) => {
	if (requestResult) {
		requestResult.textContent = "";
	}
	if (newVal) {
		const raceSelected = racesList.value.filter(
			(race) => race.id === newVal
		)[0];
		if (raceSelected) {
			id_category.value = raceSelected.id_category;
		}
	}
});

const resetRace = () => {
	id_race.value = null;
};

const updateImages = (e: any) => {
	images.value = e.target.files;
};

const submit = async (data: IOffer) => {
	let id_offer = 0;
	let imagesPath: string[] = [];
	const formData = new FormData();

	if (images.value) {
		const arrayFiles = Array.from(images.value);
		arrayFiles.map((file: any) => {
			formData.append("photos", file);
		});
	}

	await axios
		.post(`${import.meta.env.VITE_URL_BACK}/uploads`, formData)
		.then((res) => {
			imagesPath = res.data;
		});

	if (props.offer) {
		await axios
			.request({
				method: "put",
				url: `${import.meta.env.VITE_URL_BACK}/offers/${props.offer.id}`,
				data:
					data.id_status !== 2 ? data : { ...data, adoption_date: new Date() },
			})
			.then(() => {
				if (requestResult) {
					requestResult?.classList.add("text-green-400");
					requestResult?.classList.remove("text-red-400");
					requestResult.textContent =
						"L'offre d'adoption a bien été enregistrée";
				}
			})
			.catch((err) => {
				if (requestResult) {
					requestResult?.classList.remove("text-green-400");
					requestResult?.classList.add("text-red-400");
					requestResult.textContent = err.response.data.message;
				}
			});
		if (imagesPath.length) {
			imagesPath.map((image) => {
				axios.request({
					method: "post",
					url: `${import.meta.env.VITE_URL_BACK}/uploads/store`,
					data: {
						id_offer: props.offer.id,
						path: image,
						main: false,
					},
				});
			});
		}
	} else {
		await axios
			.request({
				method: "post",
				url: `${import.meta.env.VITE_URL_BACK}/offers`,
				data: { ...data, id_status: 1 },
			})
			.then((res) => {
				id_offer = res.data.id;

				if (requestResult) {
					requestResult?.classList.add("text-green-400");
					requestResult?.classList.remove("text-red-400");
					requestResult.textContent =
						"L'offre d'adoption a bien été enregistrée";
				}
			})
			.catch((err) => {
				if (requestResult) {
					requestResult?.classList.remove("text-green-400");
					requestResult?.classList.add("text-red-400");
					requestResult.textContent = err.response.data.message;
				}
			});

		imagesPath.map((image, index) => {
			if (index === 0) {
				axios.request({
					method: "post",
					url: `${import.meta.env.VITE_URL_BACK}/uploads/store`,
					data: {
						id_offer: id_offer,
						path: image,
						main: true,
					},
				});
			} else {
				axios.request({
					method: "post",
					url: `${import.meta.env.VITE_URL_BACK}/uploads/store`,
					data: {
						id_offer: id_offer,
						path: image,
						main: false,
					},
				});
			}
		});
	}
};
</script>

<style>
.form {
	overflow: hidden;
}
.photosContainer {
	display: flex;
	flex-wrap: nowrap;
	width: 500vw;
}
.photosContainer > div {
	width: 35vw !important;
}
</style>
