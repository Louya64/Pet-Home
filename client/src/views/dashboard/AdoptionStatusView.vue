<template>
	<div class="dashboardContainer">
		<h1>Les statuts des candidatures</h1>
		<AdoptionStatusCreateForm @requestResult="displayRequestResult" />
		<RequestResult :resultMessage="resultMessage" :success="requestSuccess" />
		<AdoptionStatusTable
			:adoptionStatusList="adoptionStatusList"
			@requestResult="displayRequestResult"
			@orderBy="updateOrderBy"
		/>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import axios from "axios";
import AdoptionStatusCreateForm from "@/components/adoptionStatus/AdoptionStatusCreateForm.vue";
import RequestResult from "@/components/commons/RequestResult.vue";
import AdoptionStatusTable from "@/components/adoptionStatus/AdoptionStatusTable.vue";
import type { IAdoptionStatusRes } from "@/interfaces/IAdoptionStatus";

const adoptionStatusList: Ref<IAdoptionStatusRes[]> = ref([]);
const orderBy = ref("");
const resultMessage = ref("");
const requestSuccess = ref(false);

const displayRequestResult = (success: boolean, message: string) => {
	requestSuccess.value = success;
	resultMessage.value = message;
	if (success) {
		getAdoptionStatusList();
	}
};

const updateOrderBy = (order: string) => {
	orderBy.value = `?orderBy=${order}`;
	getAdoptionStatusList();
};

const getAdoptionStatusList = () => {
	axios
		.get(`${import.meta.env.VITE_URL_BACK}/adoptionStatus${orderBy.value}`)
		.then((res) => {
			adoptionStatusList.value = res.data;
		});
};

onMounted(() => {
	getAdoptionStatusList();
});
</script>
