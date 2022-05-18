<template>
	<main class="dashboardContainer">
		<h1>Liste des annonces</h1>
		<RequestResult :resultMessage="resultMessage" :success="requestSuccess" />
		<OfferTable
			:offersList="offersList"
			@orderBy="updateOrderBy"
			@requestResult="displayRequestResult"
		/>
	</main>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted, ref, type Ref } from "vue";
import OfferTable from "@/components/offers/OfferTable.vue";
import RequestResult from "@/components/commons/RequestResult.vue";
import type { IOfferRes } from "@/interfaces/IOffer";

let offersList: Ref<IOfferRes[]> = ref([]);
const orderBy = ref("");
const resultMessage = ref("");
const requestSuccess = ref(false);

const displayRequestResult = (success: boolean, message: string) => {
	requestSuccess.value = success;
	resultMessage.value = message;
	if (success) {
		getOffersList();
	}
};

const updateOrderBy = (order: string) => {
	orderBy.value = `?orderBy=${order}`;
	getOffersList();
};

const getOffersList = () => {
	axios
		.get(`${import.meta.env.VITE_URL_BACK}/offers${orderBy.value}`)
		.then((res) => {
			offersList.value = res.data;
		});
};

onMounted(() => {
	getOffersList();
});
</script>
