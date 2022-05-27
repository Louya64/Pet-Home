<template>
	<main class="dashboardContainer">
		<h1>Accueil</h1>
		<div v-if="statsList" class="mt-20">
			<div class="flex justify-around">
				<div>
					<h2 class="text-center">Nb annonce par jour</h2>
					<table class="mx-auto">
						<thead>
							<tr>
								<th>date</th>
								<th>nb annonces</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="offer in nbOffersCreatedPerDay">
								<td>{{ offer.date }}</td>
								<td>{{ offer.count }}</td>
							</tr>
							<tr>
								<td>Total</td>
								<td>{{ nbOffers }}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div>
					<h2 class="text-center">Nb adoption par jour</h2>
					<table class="mx-auto">
						<thead>
							<tr>
								<th>date</th>
								<th>nb annonces</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="offer in nbOffersAdoptedPerDay">
								<td>{{ offer.date }}</td>
								<td>{{ offer.count }}</td>
							</tr>
							<tr>
								<td>Total</td>
								<td>{{ nbAdopted }}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div>
					<h2 class="text-center">Nb demandes d'adoption par jour</h2>
					<table class="mx-auto">
						<thead>
							<tr>
								<th>date</th>
								<th>nb annonces</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="offer in nbAdoptionRequestsPerDay">
								<td>{{ offer.date }}</td>
								<td>{{ offer.count }}</td>
							</tr>
							<tr>
								<td>Total</td>
								<td>{{ nbAdoptionRequests }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted, ref, type Ref } from "vue";

interface itemsPerDay {
	date: string;
	count: number;
}

const statsList = ref([]);
const nbOffers = ref();
const nbAdopted = ref();
const nbAdoptionRequests = ref();
const nbOffersCreatedPerDay: Ref<itemsPerDay[] | undefined> = ref();
const nbOffersAdoptedPerDay: Ref<itemsPerDay[] | undefined> = ref();
const nbAdoptionRequestsPerDay: Ref<itemsPerDay[] | undefined> = ref();

const getStatsList = () => {
	axios.get(`${import.meta.env.VITE_URL_BACK}/offers/stats`).then((res) => {
		nbOffers.value = res.data.nbOffers;
		nbAdopted.value = res.data.nbAdopted;
		nbAdoptionRequests.value = res.data.nbAdoptionRequests;
		nbOffersCreatedPerDay.value = res.data.nbOffersCreatedPerDay;
		nbOffersAdoptedPerDay.value = res.data.nbOffersAdoptedPerDay.filter(
			(record: itemsPerDay) => record.date !== null
		);
		nbAdoptionRequestsPerDay.value = res.data.nbAdoptionRequestsPerDay;
		statsList.value = res.data;
	});
};

onMounted(() => {
	getStatsList();
});
</script>
