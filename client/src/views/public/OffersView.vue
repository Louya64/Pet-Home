<template>
	<div class="siteContainer">
		<h1>
			Les {{ categorySelected.length ? categorySelected + "s" : "animaux" }} à
			adopter
		</h1>
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
			@updateOffersList="updateOffersList(true)"
		/>
		<div class="ml-[300px]">
			<div class="ml-20">
				<label for="offerId">Rechercher par n° d'annonce </label>
				<OfferInput inputId="offerId" inputType="number" v-model="offerId" />
				<button
					@click="() => router.push('/offers/' + offerId)"
					class="btn btn-green ml-4"
				>
					Rechercher
				</button>
			</div>
			<div class="ml-20">{{ matchingCount }} résultats</div>

			<div class="flex flex-wrap justify-around">
				<OfferCard v-for="offer in offersList" :offer="offer" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted, onUnmounted, ref, type Ref } from "vue";
import OfferCard from "@/components/offers/OfferCard.vue";
import OfferFilters from "@/components/offers/OfferFilters.vue";
import OfferInput from "@/components/offers/OfferInput.vue";
import { useRoute, useRouter } from "vue-router";
import type { IOfferRes } from "@/interfaces/IOffer";

const route = useRoute();
const router = useRouter();
const offersList: Ref<IOfferRes[]> = ref([]);
const namesList: Ref<string[]> = ref([]);
let filterSelected: string[] = [];
const nameSelected = ref("");
const categorySelected = ref("");
const raceSelected = ref("");
const zipcodeSelected = ref("");
const citySelected = ref("");
const ageSelected = ref("");
const matchingCount = ref(0);
let offset = 0;
const offerId = ref("");

const resetAllFilters = () => {
	filterSelected = [];
	nameSelected.value = "";
	categorySelected.value = "";
	raceSelected.value = "";
	zipcodeSelected.value = "";
	citySelected.value = "";
	ageSelected.value = "";
	updateOffersList(true);
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
};

const filterByName = (name: string) => {
	resetOneFilter("animal_name");
	nameSelected.value = name;
	filterSelected.push(`animal_name=${name}`);
};

const filterByCategory = (categoryId: number, categoryName: string) => {
	resetOneFilter("id_category");
	categorySelected.value = categoryName;
	filterSelected.push(`id_category=${categoryId}`);
};

const filterByRace = (raceId: number, raceName: string) => {
	resetOneFilter("id_race");
	raceSelected.value = raceName;
	filterSelected.push(`id_race=${raceId}`);
};

const filterByZipcode = (zipcode: string) => {
	resetOneFilter("zipcode");
	zipcodeSelected.value = zipcode;
	filterSelected.push(`zipcode=${zipcode}`);
};

const filterByCity = (city: string) => {
	resetOneFilter("city");
	citySelected.value = city;
	filterSelected.push(`city=${city}`);
};

const filterByAge = (ageName: string, minAge: number, maxAge: number) => {
	resetOneFilter("age");
	ageSelected.value = ageName;
	filterSelected.push(`age=${minAge}-${maxAge}`);
};

const updateOffersList = async (firstReq: boolean) => {
	if (firstReq) {
		offset = 0;
	}

	const filters =
		"?" +
		(filterSelected.length ? filterSelected.join("&") : "") +
		"&limit=9&offset=" +
		offset +
		"&id_status=!3";

	await axios
		.get(`${import.meta.env.VITE_URL_BACK}/offers${filters}`)
		.then((res) => {
			matchingCount.value = res.data.count;
			if (firstReq) {
				offersList.value = res.data.offers;
			} else {
				offersList.value = [...offersList.value, ...res.data.offers];
			}
		});
};

const handleScroll = () => {
	let bottomOfWindow =
		document.documentElement.scrollTop + window.innerHeight ===
		document.documentElement.offsetHeight;

	if (bottomOfWindow) {
		window.removeEventListener("scroll", handleScroll);
		offset += 9;
		updateOffersList(false);
		setTimeout(() => {
			window.addEventListener("scroll", handleScroll);
		}, 500);
	}
};

onMounted(async () => {
	if (route.query.categoryId && route.query.categoryName) {
		filterSelected = [`id_category=${route.query.categoryId}`];
		categorySelected.value = route.query.categoryName as string;
		history.replaceState(route.query, "", "offers");
	}

	await updateOffersList(true);
	namesList.value = offersList.value
		.filter((offer: IOfferRes) => offer.animal_name)
		.map((offer: IOfferRes) => offer.animal_name);

	window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll);
});
</script>
