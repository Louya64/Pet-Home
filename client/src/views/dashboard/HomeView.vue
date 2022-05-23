<template>
	<main class="dashboardContainer">
		<!-- stats users /offer/adoptionrequests -->
		<h1>Home</h1>
		<div v-if="statsList">
			<!-- <p v-for="stat in statsList">{{ stat }}</p> -->
			<p>nbOffers : {{ nbOffers }}</p>
			<p>nbAdopted : {{ nbAdopted }}</p>
		</div>
	</main>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted, ref, type Ref } from "vue";

const statsList = ref([]);
const nbOffers = ref();
const nbAdopted = ref();

const getStatsList = () => {
	axios.get(`${import.meta.env.VITE_URL_BACK}/offers/stats`).then((res) => {
		nbOffers.value = res.data.nbOffers;
		nbAdopted.value = res.data.nbAdopted;
		console.log(res.data);

		statsList.value = res.data;
	});
};

onMounted(() => {
	getStatsList();
});
</script>
