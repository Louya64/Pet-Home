<template>
	<div class="siteContainer" v-if="offer">
		<h1>Faire une demande d'adoption</h1>
		<div class="relative mt-20">
			<OfferCard :offer="offer" />
			<AdoptionRequestForm />
		</div>
	</div>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted, ref, type Ref } from "vue";
import OfferCard from "@/components/offers/OfferCard.vue";
import AdoptionRequestForm from "@/components/adoptionRequests/AdoptionRequestForm.vue";
import type { IOfferRes } from "@/interfaces/IOffer";
import { useRoute } from "vue-router";

const offer: Ref<IOfferRes | undefined> = ref();
const route = useRoute();

onMounted(() => {
	axios
		.get(`${import.meta.env.VITE_URL_BACK}/offers/${route.params.idOffer}`)
		.then((res) => {
			offer.value = res.data;
		});
});
</script>
