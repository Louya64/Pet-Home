<template>
	<div class="dashboardContainer">
		<h1>Les statuts des annonces</h1>
		<OfferStatusCreateForm @requestResult="displayRequestResult" />
		<RequestResult :resultMessage="resultMessage" :success="requestSuccess" />
		<OfferStatusTable
			:offerStatusList="offerStatusList"
			@requestResult="displayRequestResult"
			@orderBy="updateOrderBy"
		/>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import axios from "axios";
import OfferStatusCreateForm from "@/components/offerStatus/OfferStatusCreateForm.vue";
import RequestResult from "@/components/commons/RequestResult.vue";
import OfferStatusTable from "@/components/offerStatus/OfferStatusTable.vue";
import type { IOfferStatusRes } from "@/interfaces/IOfferStatus";
let offerStatusList: Ref<IOfferStatusRes[]> = ref([]);
const orderBy = ref("");
const resultMessage = ref("");
const requestSuccess = ref(false);
const displayRequestResult = (success: boolean, message: string) => {
	requestSuccess.value = success;
	resultMessage.value = message;
	if (success) {
		getOfferStatusList();
	}
};
const updateOrderBy = (order: string) => {
	orderBy.value = `?orderBy=${order}`;
	getOfferStatusList();
};
const getOfferStatusList = () => {
	axios
		.get(`${import.meta.env.VITE_URL_BACK}/offerStatus${orderBy.value}`)
		.then((res) => {
			offerStatusList.value = res.data;
		});
};
onMounted(() => {
	getOfferStatusList();
});
</script>
