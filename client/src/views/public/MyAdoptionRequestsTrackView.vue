<template>
	<div class="siteContainer">
		<h1>Mes demandes d'adoption</h1>
		<div class="w-[300px] h-[90vh] fixed top-[10vh] pl-5">
			<ul v-if="myOffersList.length" class="overflow-y-auto h-[90vh] pr-5">
				<li
					v-for="adoptionRequest in myAdoptionRequestsList"
					class="flex items-center"
				>
					<OfferCard
						class="w-[100%]"
						:offer="
							myOffersList.filter(
								(offer) => offer.id === adoptionRequest.id_offer
							)[0]
						"
					/>
					<div @click="() => (currentTrack = adoptionRequest.id)">
						Messagerie
					</div>
				</li>
			</ul>
		</div>
		<div v-if="currentTrack" class="ml-[300px] p-20">
			<Messages :idReq="currentTrack" />
			<!-- meaages et socket -->
		</div>
		<div class="ml-[300px]">
			<Socket origin="du site" />
		</div>
	</div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, type Ref, onMounted } from "vue";
import type { IAdoptionRequestRes } from "@/interfaces/IAdoptionRequest";
import type { IOfferRes } from "@/interfaces/IOffer";
import OfferCard from "@/components/offers/OfferCard.vue";
import Messages from "@/components/adoptionRequests/Messages.vue";
import Socket from "@/components/adoptionRequests/Socket.vue";

let myAdoptionRequestsList: Ref<IAdoptionRequestRes[]> = ref([]);
let myOffersList: Ref<IOfferRes[]> = ref([]);
const currentTrack = ref(0);

const getMyAdoptionRequestsList = async () => {
	await axios
		.get(
			`${
				import.meta.env.VITE_URL_BACK
			}/adoptionRequests?userId=${localStorage.getItem("userId")}`
		)
		.then(async (res) => {
			myAdoptionRequestsList.value = res.data;
			currentTrack.value = res.data[0].id;
			const idOffersArray = res.data.map(
				(adoptionReq: IAdoptionRequestRes) => adoptionReq.id_offer
			);
			await axios
				.get(`${import.meta.env.VITE_URL_BACK}/offers?idIn=${idOffersArray}`)
				.then((res) => {
					myOffersList.value = res.data;
				});
		});
};

onMounted(() => {
	getMyAdoptionRequestsList();
});
</script>
