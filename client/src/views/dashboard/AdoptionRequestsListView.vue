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
import { onMounted, onUnmounted, ref, type Ref } from "vue";
import AdoptionRequestTable from "@/components/adoptionRequests/AdoptionRequestTable.vue";
import type { IAdoptionRequestRes } from "@/interfaces/IAdoptionRequest";

const adoptionRequestsList: Ref<IAdoptionRequestRes[]> = ref([]);
const orderBy = ref("");
let offset = 0;

const updateOrderBy = (order: string) => {
	orderBy.value = `?orderBy=${order}`;
	getAdoptionRequestsList(true);
};

const getAdoptionRequestsList = (firstReq: boolean) => {
	if (firstReq) {
		offset = 0;
	}
	const limit = orderBy.value
		? `&limit=15&offset=${offset}`
		: `?limit=15&offset=${offset}`;

	axios
		.get(
			`${import.meta.env.VITE_URL_BACK}/adoptionRequests${
				orderBy.value
			}${limit}`
		)
		.then((res) => {
			if (firstReq) {
				adoptionRequestsList.value = res.data;
			} else {
				adoptionRequestsList.value = [
					...adoptionRequestsList.value,
					...res.data,
				];
			}
		});
};

const handleScroll = () => {
	let bottomOfWindow =
		document.documentElement.scrollTop + window.innerHeight ===
		document.documentElement.offsetHeight;

	if (bottomOfWindow) {
		window.removeEventListener("scroll", handleScroll);
		offset += 15;
		getAdoptionRequestsList(false);
		setTimeout(() => {
			window.addEventListener("scroll", handleScroll);
		}, 500);
	}
};

onMounted(() => {
	getAdoptionRequestsList(true);
	window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll);
});
</script>
