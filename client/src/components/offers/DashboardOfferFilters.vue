<template>
	<form
		@submit.prevent="sendSearch"
		class="bg-slate-700 min-w-fit p-5 border-2 m-2"
	>
		<div class="flex w-full justify-between">
			<h2 class="text-lg text-white">Rechercher par</h2>
			<font-awesome-icon
				title="remettre les filtres à 0"
				@click="resetSearch"
				class="text-2xl -mb-1 hover:cursor-pointer"
				icon="xmark"
			/>
		</div>
		<div class="flex">
			<select class="form-item-input text-sm mr-2" v-model="fieldnameVal">
				<option value="">Colonne</option>
				<option value="creation_date">Date de création</option>
				<option value="adoption_date">Date d'adoption</option>
				<option value="id_status">Statut</option>
				<option value="animal_name">Nom de l'animal</option>
				<option value="age">Age de l'animal</option>
				<option value="id_category">Catégorie</option>
				<option value="id_race">Race</option>
				<option value="zipcode">Code postal</option>
				<option value="city">Ville</option>
				<option value="identified">Identfication</option>
				<option value="vaccinated">Vaccination</option>
				<option value="disabled">Handicap</option>
				<option value="disability">Nom du handicap</option>
				<option value="description">Description</option>
			</select>
			<div v-if="searchType === 'contains'">
				contenant
				<input
					class="form-item-input text-sm"
					type="text"
					v-model="searchVal"
				/>
			</div>
			<div v-if="searchType === 'equal'">
				<select
					v-if="fieldnameVal === 'id_status'"
					class="form-item-input text-sm"
					v-model="searchVal"
				>
					<option value="">Sélectionnez un statut</option>
					<option v-for="status in offerStatusList" :value="status.id">
						{{ status.name }}
					</option>
				</select>
				<select
					v-if="fieldnameVal === 'id_category'"
					class="form-item-input text-sm"
					v-model="searchVal"
				>
					<option value="">Sélectionnez une categorie</option>
					<option v-for="category in categoriesList" :value="category.id">
						{{ category.name }}
					</option>
				</select>
				<select
					v-if="fieldnameVal === 'id_race'"
					class="form-item-input text-sm"
					v-model="searchVal"
				>
					<option value="">Sélectionnez une race</option>
					<option v-for="race in racesList" :value="race.id">
						{{ race.name }}
					</option>
				</select>
				<select
					v-if="
						fieldnameVal === 'identified' ||
						fieldnameVal === 'vaccinated' ||
						fieldnameVal === 'disabled'
					"
					class="form-item-input text-sm"
					v-model="searchVal"
				>
					<option value="">Sélectionnez une valeur</option>
					<option value="true">Présent(e)</option>
					<option value="false">Absent(e)</option>
				</select>
			</div>
			<div v-if="searchType === 'select'">
				<select class="form-item-input text-sm" v-model="selectVal">
					<option value="lessThan">inférieur à</option>
					<option value="equal">égal à</option>
					<option value="greaterThan">supérieur à</option>
					<option value="between">entre</option>
				</select>
			</div>
		</div>
		<div v-if="fieldnameVal === 'age'">
			<AgeSelects
				:age="age"
				@setAge="(ageVal) => (searchVal = ageVal.toString())"
			/>
			<div v-if="selectVal === 'between'">
				et
				<AgeSelects
					:age="age"
					@setAge="(ageVal) => (searchValMax = ageVal.toString())"
				/>
			</div>
		</div>
		<div
			v-if="
				fieldnameVal === 'creation_date' || fieldnameVal === 'adoption_date'
			"
		>
			<div class="w-full relative">
				<input
					class="form-item-input text-sm w-full"
					type="date"
					v-model="searchVal"
				/>
			</div>
			<div v-if="selectVal === 'between'">
				et <br />
				<div class="w-full relative">
					<input
						class="form-item-input text-sm w-full"
						type="date"
						v-model="searchValMax"
					/>
				</div>
			</div>
		</div>

		<div class="flex justify-end">
			<button type="submit" class="btn btn-green">Rechercher</button>
		</div>
	</form>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from "vue";
import type { IOfferStatusRes } from "@/interfaces/IOfferStatus";
import type { ICategoryRes } from "@/interfaces/ICategory";
import type { IRaceRes } from "@/interfaces/IRace";
import axios from "axios";
import AgeSelects from "./AgeSelects.vue";

const emit = defineEmits<{
	(e: "search", fieldname: string, searchVal: string, searchType: string): void;
}>();

const fieldnameVal = ref("");
const searchVal = ref("");
const searchValMax = ref("");
const searchType = ref("contains");
const offerStatusList: Ref<IOfferStatusRes[]> = ref([]);
const categoriesList: Ref<ICategoryRes[]> = ref([]);
const racesList: Ref<IRaceRes[]> = ref([]);
const age = ref(0);
const selectVal = ref("equal");

watch(fieldnameVal, () => {
	switch (fieldnameVal.value) {
		case "creation_date":
		case "adoption_date":
		case "age":
			searchType.value = "select";
			break;
		case "id_status":
		case "id_category":
		case "id_race":
		case "identified":
		case "vaccinated":
		case "disabled":
			searchType.value = "equal";
			break;
		default:
			searchType.value = "contains";
	}
});

const getStatusList = () => {
	axios.get(`${import.meta.env.VITE_URL_BACK}/offerStatus`).then((res) => {
		offerStatusList.value = res.data;
	});
};

const getCategoriesList = () => {
	axios.get(`${import.meta.env.VITE_URL_BACK}/categories`).then((res) => {
		categoriesList.value = res.data;
	});
};

const getRacesList = () => {
	axios.get(`${import.meta.env.VITE_URL_BACK}/races`).then((res) => {
		racesList.value = res.data;
	});
};

onMounted(() => {
	getStatusList();
	getCategoriesList();
	getRacesList();
});

const sendSearch = () => {
	let truc = searchType.value;
	if (searchType.value === "select") {
		truc = "equal";
		switch (selectVal.value) {
			case "lessThan":
				searchVal.value = `lessThan-${searchVal.value}`;
				break;
			case "equal":
				searchVal.value = `equal-${searchVal.value}`;
				break;
			case "greaterThan":
				searchVal.value = `greaterThan-${searchVal.value}`;
				break;
			case "between":
				searchVal.value = `${searchVal.value}-${searchValMax.value}`;
				break;
		}
	}

	if (fieldnameVal.value && searchVal.value) {
		emit("search", fieldnameVal.value, searchVal.value, truc);
	} else {
		emit("search", "", "", "");
	}
};

const resetSearch = () => {
	emit("search", "", "", "");
	fieldnameVal.value = "";
	searchVal.value = "";
	searchType.value = "contains";
	selectVal.value = "equal";
};
</script>
