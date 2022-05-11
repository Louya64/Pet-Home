<template>
	<div class="siteContainer">
		<h1>
			Les {{ categorySelected.length ? categorySelected + "s" : "animaux" }} à
			adopter
		</h1>
		<div class="flex">
			<OfferFilters
				:namesList="namesList"
				:nameSelected="nameSelected"
				:categorySelected="categorySelected"
				:raceSelected="raceSelected"
				:zipcodeSelected="zipcodeSelected"
				:citySelected="citySelected"
				:ageSelected="ageSelected"
				@resetAllFilters="resetAllFilters"
				@resetOneFilter="resetOneFilter"
				@filterByName="filterByName"
				@filterByCategory="filterByCategory"
				@filterByRace="filterByRace"
				@filterByZipcode="filterByZipcode"
				@filterByCity="filterByCity"
				@filterByAge="filterByAge"
			/>
			<div class="flex-1">
				<div class="ml-20">{{ offersList.length }} résultats</div>

				<div class="flex flex-wrap justify-around">
					<OfferCard v-for="offer in offersList" :offer="offer" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted, ref, type Ref } from "vue";
import OfferCard from "../../components/offers/OfferCard.vue";
import OfferFilters from "../../components/offers/OfferFilters.vue";
import { useRoute } from "vue-router";

interface IOffer {
	id: number;
	creation_date: string;
	adoption_date: string | null;
	status: {
		name: string;
	};
	animal_name: string;
	age: number;
	category: {
		name: string;
	};
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

const route = useRoute();
let offersList: Ref<IOffer[]> = ref([]);
let namesList: Ref<string[]> = ref([]);
let filterSelected: string[] = [];
const nameSelected = ref("");
const categorySelected = ref("");
const raceSelected = ref("");
const zipcodeSelected = ref("");
const citySelected = ref("");
const ageSelected = ref("");

const resetAllFilters = () => {
	filterSelected = [];
	nameSelected.value = "";
	categorySelected.value = "";
	raceSelected.value = "";
	zipcodeSelected.value = "";
	citySelected.value = "";
	ageSelected.value = "";
	updateOffersList();
};

const resetOneFilter = (filterToRemove: string) => {
	if (filterToRemove === "animal_name") {
		nameSelected.value = "";
	}
	if (filterToRemove === "id_category") {
		categorySelected.value = "";
	}
	if (filterToRemove === "id_race") {
		raceSelected.value = "";
	}
	if (filterToRemove === "zipcode") {
		zipcodeSelected.value = "";
	}
	if (filterToRemove === "city") {
		citySelected.value = "";
	}
	if (filterToRemove === "age") {
		ageSelected.value = "";
	}

	let indexToRemove: number | null = null;
	filterSelected.map((filter, index) => {
		if (filter.indexOf(filterToRemove) !== -1) {
			indexToRemove = index;
		}
	});
	if (indexToRemove !== null) {
		filterSelected.splice(indexToRemove, 1);
	}
	updateOffersList();
};

const filterByName = (name: string) => {
	resetOneFilter("animal_name");
	nameSelected.value = name;
	filterSelected.push(`animal_name=${name}`);
	updateOffersList();
};

const filterByCategory = (categoryId: number, categoryName: string) => {
	resetOneFilter("id_category");
	categorySelected.value = categoryName;
	filterSelected.push(`id_category=${categoryId}`);
	updateOffersList();
};

const filterByRace = (raceId: number, raceName: string) => {
	resetOneFilter("id_race");
	raceSelected.value = raceName;
	filterSelected.push(`id_race=${raceId}`);
	updateOffersList();
};

const filterByZipcode = (zipcode: string) => {
	resetOneFilter("zipcode");
	zipcodeSelected.value = zipcode;
	filterSelected.push(`zipcode=${zipcode}`);
	updateOffersList();
};

const filterByCity = (city: string) => {
	resetOneFilter("city");
	citySelected.value = city;
	filterSelected.push(`city=${city}`);
	updateOffersList();
};

const filterByAge = (ageName: string, minAge: number, maxAge: number) => {
	resetOneFilter("age");
	ageSelected.value = ageName;
	filterSelected.push(`age=${minAge}-${maxAge}`);
	updateOffersList();
};

const updateOffersList = async () => {
	const filters = filterSelected.length ? "?" + filterSelected.join("&") : "";
	offersList.value = await axios
		.get(`${import.meta.env.VITE_URL_BACK}/offers${filters}`)
		.then((res) => {
			return res.data;
		});
};

onMounted(async () => {
	if (route.query.categoryId && route.query.categoryName) {
		filterSelected = [`id_category=${route.query.categoryId}`];
		categorySelected.value = route.query.categoryName as string;
		history.replaceState(route.query, "", "offers");
	}
	await updateOffersList();
	namesList.value = offersList.value
		.filter((offer: IOffer) => offer.animal_name)
		.map((offer: IOffer) => offer.animal_name);
});
</script>
