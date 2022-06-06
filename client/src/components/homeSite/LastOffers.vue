<template>
	<div class="py-20">
		<h2 class="text-xl">Les dernières annonces</h2>
		<div class="p-10 flex" v-if="LastOffersList">
			<OfferCard v-for="offer in LastOffersList" :offer="offer" />
		</div>
	</div>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted, ref, type Ref } from "vue";
import OfferCard from "../offers/OfferCard.vue";
import type { IOfferRes } from "@/interfaces/IOffer";

const LastOffersList: Ref<IOfferRes[]> = ref([]);
const query = ref(`?orderBy=creation_date-desc&limit=5&id_status=!3`);

const getLastOffersList = () => {
	axios
		.get(`${import.meta.env.VITE_URL_BACK}/offers${query.value}`)
		.then((res) => {
			LastOffersList.value = res.data.offers;
		});
};

onMounted(() => {
	getLastOffersList();
});
</script>
