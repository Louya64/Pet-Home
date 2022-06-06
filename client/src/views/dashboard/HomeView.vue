<template>
	<main class="dashboardContainer">
		<h1>Accueil</h1>
		<div v-if="statArrays" class="mt-20">
			<div class="flex justify-around">
				<div v-for="statArray in statArrays">
					<h2 class="text-center">{{ statArray.title }}</h2>
					<table class="mx-auto">
						<thead>
							<tr>
								<th>date</th>
								<th>nb annonces</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="offer in statArray.array">
								<td>{{ offer.date }}</td>
								<td>{{ offer.count }}</td>
							</tr>
							<tr>
								<td>Total</td>
								<td>{{ statArray.sum }}</td>
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
	title: string;
	sum: number;
	array: [
		{
			date: string;
			count: number;
		}
	];
}

const statArrays: Ref<itemsPerDay[] | undefined> = ref();

const getStatsList = () => {
	axios.get(`${import.meta.env.VITE_URL_BACK}/offers/stats`).then((res) => {
		statArrays.value = res.data;
	});
};

onMounted(() => {
	getStatsList();
});
</script>
