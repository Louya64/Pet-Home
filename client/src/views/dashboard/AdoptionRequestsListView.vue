<template>
	<div class="dashboardContainer">
		<h1>Liste des candidatures</h1>
		<AdoptionRequestTable
			:adoptionRequestsList="adoptionRequestsList"
			@orderBy="updateOrderBy"
		/>
	</div>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted, ref, type Ref } from "vue";
import AdoptionRequestTable from "@/components/adoptionRequests/AdoptionRequestTable.vue";
import type { IAdoptionRequestRes } from "@/interfaces/IAdoptionRequest";

const adoptionRequestsList: Ref<IAdoptionRequestRes[]> = ref([]);
const orderBy = ref("");

const updateOrderBy = (order: string) => {
	orderBy.value = `?orderBy=${order}`;
	getAdoptionRequestsList();
};

const getAdoptionRequestsList = () => {
	axios
		.get(`${import.meta.env.VITE_URL_BACK}/adoptionRequests${orderBy.value}`)
		.then((res) => {
			adoptionRequestsList.value = res.data;
		});
};

onMounted(() => {
	getAdoptionRequestsList();
});
</script>
