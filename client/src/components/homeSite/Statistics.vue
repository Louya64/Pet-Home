<template>
	<div class="py-20">
		<h2 class="text-xl">Quelques statistiques :</h2>
		<p class="p-10">
			Nombre d'animaux adoptés depuis la création du site : {{ nbAdopted }}
			<br />
			Nombre d'animaux récupérés au refuge : {{ nbOffers }} <br />
			<!-- Nombre de dossiers reçu par jour : {{ avgDailyAdoptionRequests }} <br /> -->
		</p>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const nbAdopted = ref(0);
const nbOffers = ref(0);
// const avgDailyAdoptionRequests = ref(0);

const getOffersStats = () => {
	axios.get(`${import.meta.env.VITE_URL_BACK}/offers/stats`).then((res) => {
		nbAdopted.value = res.data.nbAdopted;
		nbOffers.value = res.data.nbOffers;
	});
};

onMounted(() => {
	getOffersStats();
});
</script>
