<template>
	<div class="dashboardContainer">
		<h1>Les races d'animaux</h1>
		<RaceCreateForm
			:categoriesList="categoriesList"
			@requestResult="displayRequestResult"
		/>
		<RequestResult :resultMessage="resultMessage" :success="requestSuccess" />
		<RaceTable
			:racesList="racesList"
			:categoriesList="categoriesList"
			@requestResult="displayRequestResult"
			@orderBy="updateOrderBy"
		/>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import axios from "axios";
import RaceCreateForm from "@/components/races/RaceCreateForm.vue";
import RequestResult from "@/components/commons/RequestResult.vue";
import RaceTable from "@/components/races/RaceTable.vue";
import type { IRaceRes } from "@/interfaces/IRace";
import type { ICategoryRes } from "@/interfaces/ICategory";

const racesList: Ref<IRaceRes[]> = ref([]);
const categoriesList: Ref<ICategoryRes[]> = ref([]);
const orderBy = ref("");
const resultMessage = ref("");
const requestSuccess = ref(false);

const displayRequestResult = (success: boolean, message: string) => {
	requestSuccess.value = success;
	resultMessage.value = message;
	if (success) {
		getRacesList();
	}
};

const updateOrderBy = (order: string) => {
	orderBy.value = `?orderBy=${order}`;
	getRacesList();
};

const getRacesList = () => {
	axios
		.get(`${import.meta.env.VITE_URL_BACK}/races${orderBy.value}`)
		.then((res) => {
			racesList.value = res.data;
		});
};

const getCategoriesList = () => {
	axios.get(`${import.meta.env.VITE_URL_BACK}/categories`).then((res) => {
		categoriesList.value = res.data;
	});
};

onMounted(() => {
	getRacesList();
	getCategoriesList();
});
</script>
