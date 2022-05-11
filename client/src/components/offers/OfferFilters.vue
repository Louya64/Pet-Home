<template>
	<div class="bg-orange-700/50 w-[300px] min-h-[90vh] sticky top-[10vh] px-5">
		<div class="flex justify-between mt-2">
			<h2 class="text-center text-2xl">Filtres</h2>
			<font-awesome-icon
				title="remettre les filtres à 0"
				@click="() => emit('resetAllFilters')"
				class="text-2xl -mb-1 hover:cursor-pointer"
				icon="xmark"
			/>
		</div>

		<!-- tags -->
		<div class="flex flex-wrap">
			<div v-if="nameSelected">
				<SearchTag
					:selectedValue="nameSelected"
					@resetFilter="
						() => {
							emit('resetOneFilter', 'animal_name');
						}
					"
				/>
			</div>
			<div v-if="categorySelected">
				<SearchTag
					:selectedValue="categorySelected"
					@resetFilter="
						() => {
							emit('resetOneFilter', 'id_category'), updateRaces(null);
						}
					"
				/>
			</div>
			<div v-if="raceSelected">
				<SearchTag
					:selectedValue="raceSelected"
					@resetFilter="
						() => {
							emit('resetOneFilter', 'id_race');
						}
					"
				/>
			</div>
			<div v-if="zipcodeSelected">
				<SearchTag
					:selectedValue="zipcodeSelected"
					@resetFilter="
						() => {
							emit('resetOneFilter', 'zipcode');
						}
					"
				/>
			</div>
			<div v-if="citySelected">
				<SearchTag
					:selectedValue="citySelected"
					@resetFilter="
						() => {
							emit('resetOneFilter', 'city');
						}
					"
				/>
			</div>
			<div v-if="ageSelected">
				<SearchTag
					:selectedValue="ageSelected"
					@resetFilter="
						() => {
							emit('resetOneFilter', 'age');
						}
					"
				/>
			</div>
		</div>

		<!-- search by animal_name -->
		<div class="form-item">
			<SearchFieldHeader
				title="Nom de l'animal"
				fieldName="animal_name"
				:active="searchByName"
				:valueSelected="nameSelected"
				@activeSearch="(active) => (searchByName = active)"
			/>
			<div v-if="searchByName">
				<input
					class="form-item-input"
					type="text"
					id="animal_name"
					v-model="inputNameSearch"
				/>
				<ul class="px-10">
					<li
						class="hover:cursor-pointer hover:bg-orange-100"
						v-for="name in namesListFiltered"
						@click="
							() => {
								emit('filterByName', name),
									(searchByName = false),
									(inputNameSearch = '');
							}
						"
					>
						{{ name }}
					</li>
				</ul>
			</div>
		</div>

		<!-- search by category -->
		<div class="form-item">
			<SearchFieldHeader
				title="Espèce"
				fieldName="id_category"
				:active="searchByCategory"
				:valueSelected="categorySelected"
				@activeSearch="(active) => (searchByCategory = active)"
			/>
			<div v-if="searchByCategory">
				<ul class="px-10">
					<li
						class="hover:cursor-pointer hover:bg-orange-100"
						v-for="category in categoriesList"
						@click="
							() => {
								emit('filterByCategory', category.id, category.name),
									updateRaces(category.id),
									emit('resetOneFilter', 'id_race'),
									(searchByCategory = false);
							}
						"
					>
						{{ category.name }}
					</li>
				</ul>
			</div>
		</div>

		<!-- search by race -->
		<div class="form-item">
			<SearchFieldHeader
				title="Race"
				fieldName="id_race"
				:active="searchByRace"
				:valueSelected="raceSelected"
				@activeSearch="(active) => (searchByRace = active)"
			/>
			<div v-if="searchByRace">
				<ul class="px-10">
					<li
						class="hover:cursor-pointer hover:bg-orange-100"
						v-for="race in racesListFitered"
						@click="
							() => {
								emit('filterByRace', race.id, race.name),
									(searchByRace = false);
							}
						"
					>
						{{ race.name }}
					</li>
				</ul>
			</div>
		</div>

		<!-- search by zipcode -->
		<div class="form-item">
			<SearchFieldHeader
				title="Code postal"
				fieldName="zipcode"
				:active="searchByZipcode"
				:valueSelected="zipcodeSelected"
				@activeSearch="(active) => (searchByZipcode = active)"
			/>
			<div v-if="searchByZipcode">
				<input
					class="form-item-input"
					type="number"
					id="zipcode"
					v-model="zipcode"
					maxlength="5"
				/>
			</div>
		</div>

		<!-- search by city -->
		<div class="form-item">
			<SearchFieldHeader
				title="Ville"
				fieldName="city"
				:active="searchByCity"
				:valueSelected="citySelected"
				@activeSearch="(active) => (searchByCity = active)"
			/>
			<div v-if="searchByCity" class="relative">
				<input class="form-item-input" type="text" id="city" v-model="city" />
				<font-awesome-icon
					class="text-lg hover:cursor-pointer absolute right-5 top-0 p-5"
					icon="magnifying-glass"
					@click="
						() => {
							emit('filterByCity', city), (searchByCity = false);
						}
					"
				/>
			</div>
		</div>

		<!-- search by age -->
		<div class="form-item">
			<SearchFieldHeader
				title="Age"
				fieldName="age"
				:active="searchByAge"
				:valueSelected="ageSelected"
				@activeSearch="(active) => (searchByAge = active)"
			/>
			<div v-if="searchByAge">
				<ul class="px-10">
					<li
						class="hover:cursor-pointer hover:bg-orange-100"
						@click="
							() => {
								emit('filterByAge', '0-3 mois', 0, 3), (searchByAge = false);
							}
						"
					>
						0-3 mois
					</li>
					<li
						class="hover:cursor-pointer hover:bg-orange-100"
						@click="
							() => {
								emit('filterByAge', '3-6 mois', 3, 6), (searchByAge = false);
							}
						"
					>
						3-6 mois
					</li>
					<li
						class="hover:cursor-pointer hover:bg-orange-100"
						@click="
							() => {
								emit('filterByAge', '6-12 mois', 6, 12), (searchByAge = false);
							}
						"
					>
						6-12 mois
					</li>
					<li
						class="hover:cursor-pointer hover:bg-orange-100"
						@click="
							() => {
								emit('filterByAge', '1-2 ans', 12, 24), (searchByAge = false);
							}
						"
					>
						1-2 ans
					</li>
					<li
						class="hover:cursor-pointer hover:bg-orange-100"
						@click="
							() => {
								emit('filterByAge', '2 ans et plus', 24, 240),
									(searchByAge = false);
							}
						"
					>
						2 ans et plus
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, type Ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import SearchTag from "./SearchTag.vue";
import SearchFieldHeader from "./SearchFieldHeader.vue";
import { useRoute } from "vue-router";

interface Props {
	namesList: string[];
	nameSelected: string;
	categorySelected: string;
	raceSelected: string;
	zipcodeSelected: string;
	citySelected: string;
	ageSelected: string;
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

const emit = defineEmits<{
	(e: "resetAllFilters"): void;
	(e: "resetOneFilter", filterToRemove: string): void;
	(e: "filterByName", name: string): void;
	(e: "filterByCategory", categoryId: number, categoryName: string): void;
	(e: "filterByRace", raceId: number, raceName: string): void;
	(e: "filterByZipcode", zipcode: string): void;
	(e: "filterByCity", city: string): void;
	(e: "filterByAge", ageName: string, minAge: number, maxAge: number): void;
}>();

const props = defineProps<Props>();
const route = useRoute();

const searchByName = ref(false);
const inputNameSearch = ref("");
const namesListFiltered = computed(() => {
	if (inputNameSearch)
		return props.namesList.filter((name) =>
			name.toLowerCase().includes(inputNameSearch.value.toLowerCase())
		);
});

const searchByCategory = ref(false);
let categoriesList: Ref<ICategory[]> = ref([]);

const searchByRace = ref(false);
let racesList: Ref<IRace[]> = ref([]);
let racesListFitered: Ref<IRace[]> = ref([]);
const updateRaces = (categoryId: number | null) => {
	if (categoryId !== null) {
		racesListFitered.value = racesList.value.filter(
			(race) => race.id_category === categoryId
		);
	} else {
		racesListFitered.value = racesList.value;
	}
};

const searchByZipcode = ref(false);
const zipcode = ref("");
watch(zipcode, (newVal) => {
	if (newVal.toString().length === 5) {
		searchByZipcode.value = false;
		emit("filterByZipcode", zipcode.value);
	}
});

const searchByCity = ref(false);
const city = ref("");

const searchByAge = ref(false);

onMounted(() => {
	axios.get(`${import.meta.env.VITE_URL_BACK}/categories`).then((res) => {
		categoriesList.value = res.data;
	});

	if (route.query.categoryId) {
		axios.get(`${import.meta.env.VITE_URL_BACK}/races`).then((res) => {
			racesList.value = res.data;
			racesListFitered.value = res.data.filter(
				(race: IRace) => race.id_category === Number(route.query.categoryId)
			);
		});
	} else {
		axios.get(`${import.meta.env.VITE_URL_BACK}/races`).then((res) => {
			racesList.value = racesListFitered.value = res.data;
		});
	}
});
</script>
