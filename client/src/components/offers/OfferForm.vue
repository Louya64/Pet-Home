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
		<div class="w-1/4 px-10 mx-auto" v-if="props.offer">
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
						Age</label
					>
					<div class="flex justify-between">
						<div class="w-1/3 flex items-center">
							<select
								class="form-item-input flex-1 mx-1"
								id="ageYear"
								v-model="ageYear"
							>
								<option value="0">0</option>
								<option value="12">1</option>
								<option value="24">2</option>
								<option value="36">3</option>
								<option value="48">4</option>
								<option value="60">5</option>
								<option value="72">6</option>
								<option value="84">7</option>
								<option value="96">8</option>
								<option value="108">9</option>
								<option value="120">10</option>
								<option value="132">11</option>
								<option value="144">12</option>
								<option value="156">13</option>
								<option value="168">14</option>
								<option value="180">15</option>
								<option value="192">16</option>
								<option value="204">17</option>
								<option value="216">18</option>
								<option value="228">19</option>
								<option value="240">20</option>
							</select>
							<label for="ageYear"> ans</label>
						</div>
						<div class="w-1/3 flex items-center">
							<select
								class="form-item-input flex-1 mx-1"
								id="ageMonth"
								v-model="ageMonth"
							>
								<option value="0">0</option>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
								<option value="6">6</option>
								<option value="7">7</option>
								<option value="8">8</option>
								<option value="9">9</option>
								<option value="10">10</option>
								<option value="11">11</option>
							</select>
							<label for="ageMonth"> mois</label>
						</div>
					</div>
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
						@input="
							if (zipcode > 99999) {
								zipcode = 99999;
							} else if (zipcode < 0) {
								zipcode = 0;
							}
						"
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

		<PhotosDisplayed
			v-if="props.offer && !noPhotos"
			:offerId="props.offer.id"
			:offerCategory="props.offer.category.name"
			@photosEmpty="() => (noPhotos = true)"
		/>

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
		<RequestResult :resultMessage="resultMessage" :success="requestSuccess" />
		<div class="flex justify-end">
			<button class="btn btn-green">Enregistrer</button>
		</div>
	</form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, type Ref } from "vue";
import axios from "axios";
import Switch from "./Switch.vue";
import PhotosDisplayed from "./PhotosDisplayed.vue";
import RequestResult from "@/components/commons/RequestResult.vue";
import type {
	IOfferRes,
	IOfferCreate,
	IOfferCreateOrUpdate,
} from "@/interfaces/IOffer";
import type { ICategoryRes } from "@/interfaces/ICategory";
import type { IRaceRes } from "@/interfaces/IRace";
import type { IOfferStatusRes } from "@/interfaces/IOfferStatus";

interface Props {
	offer: IOfferRes | null;
}

const props = defineProps<Props>();
const categoriesList: Ref<ICategoryRes[]> = ref([]);
const racesList: Ref<IRaceRes[]> = ref([]);
const offerStatusList: Ref<IOfferStatusRes[]> = ref([]);
const animal_name = ref("");
const ageMonth = ref(0);
const ageYear = ref(0);
const age = computed(() => {
	return Number(ageMonth.value) + Number(ageYear.value);
});
const id_category = ref(0);
const id_race: Ref<null | number> = ref(null);
const zipcode = ref(0);
const city = ref("");
const identified = ref(false);
const vaccinated = ref(false);
const disabled = ref(false);
const disability = ref("");
const description = ref("");
const noPhotos = ref(false);
const resultMessage = ref("");
const requestSuccess = ref(false);
const images: Ref<FileList | null> = ref(null);
const id_status = ref(1);

if (props.offer) {
	if (props.offer.animal_name) animal_name.value = props.offer.animal_name;
	ageYear.value = Math.floor(props.offer.age / 12) * 12;
	ageMonth.value = props.offer.age - ageYear.value;
	id_category.value = props.offer.id_category;
	id_race.value = props.offer.id_race;
	zipcode.value = props.offer.zipcode;
	city.value = props.offer.city;
	identified.value = props.offer.identified;
	vaccinated.value = props.offer.vaccinated;
	disabled.value = props.offer.disabled;
	if (props.offer.disability) disability.value = props.offer.disability;
	if (props.offer.description) description.value = props.offer.description;
	id_status.value = props.offer.id_status;
}

onMounted(() => {
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
	if (newVal) {
		axios
			.get(`${import.meta.env.VITE_URL_BACK}/races?id_category=${newVal}`)
			.then((res) => {
				racesList.value = res.data;
			});
	}
});

watch(id_race, (newVal) => {
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

const updateImages = (e: Event) => {
	images.value = (<HTMLInputElement>e.target).files;
};

const submit = async (data: IOfferCreate) => {
	const formData = new FormData();

	if (images.value) {
		const arrayFiles = Array.from(images.value);
		arrayFiles.map((file: File) => {
			formData.append("photos", file);
		});
	}

	let dataToSend: IOfferCreateOrUpdate = { ...data };
	if (props.offer) {
		if (props.offer.id_status === 1 && id_status.value !== 1) {
			dataToSend = { ...dataToSend, adoption_date: new Date() };
		}
	}

	Object.entries(dataToSend).forEach(([k, v]: [string, string | Blob]) => {
		formData.append(k, v);
	});

	if (props.offer) {
		await axios
			.put(
				`${import.meta.env.VITE_URL_BACK}/offers/${props.offer.id}`,
				formData
			)
			.then(() => {
				requestSuccess.value = true;
				resultMessage.value = "L'offre d'adoption a bien été modifiée";
			})
			.catch((err) => {
				requestSuccess.value = false;
				resultMessage.value = err.response.data.message;
			});
	} else {
		await axios
			.post(`${import.meta.env.VITE_URL_BACK}/offers`, formData)
			.then(() => {
				requestSuccess.value = true;
				resultMessage.value = "L'offre d'adoption a bien été enregistrée";
				animal_name.value = "";
				ageMonth.value = 0;
				ageYear.value = 0;
				id_category.value = 0;
				id_race.value = null;
				zipcode.value = 0;
				city.value = "";
				identified.value = false;
				vaccinated.value = false;
				disabled.value = false;
				disability.value = "";
				description.value = "";
			})
			.catch((err) => {
				requestSuccess.value = false;
				resultMessage.value = err.response.data.message;
			});
	}
};
</script>
