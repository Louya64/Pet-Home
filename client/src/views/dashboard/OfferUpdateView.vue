<template>
	<div class="dashboardContainer">
		<h1>Modifier une annonce</h1>
		<OfferForm
			v-if="offer && photos"
			:offer="offer"
			:photos="photos"
			@update-photos="getPhotos"
		/>
	</div>
</template>

<script setup lang="ts">
import OfferForm from "@/components/offers/OfferForm.vue";
import axios from "axios";
import { ref, onMounted, type Ref } from "vue";
import { useRoute } from "vue-router";

interface IOffer {
	id: number;
	creation_date: string;
	adoption_date: string | null;
	id_status: number;
	status: {
		name: string;
	};
	animal_name: string;
	age: number;
	id_category: number;
	category: {
		name: string;
	};
	id_race: number | null;
	race: {
		name: string;
	} | null;
	zipcode: number;
	city: string;
	identified: boolean;
	vaccinated: boolean;
	disabled: boolean;
	disability: string;
	description: string;
}
interface IPhoto {
	id: number;
	id_offer: number;
	main: boolean;
	path: string;
}

const route = useRoute();
const offer: Ref<IOffer | undefined> = ref();
const photos: Ref<IPhoto[] | undefined> = ref();

const getPhotos = () => {
	photos.value = undefined;

	axios
		.get(`${import.meta.env.VITE_URL_BACK}/uploads?id_offer=${route.params.id}`)
		.then((res) => {
			if (res.data.length) {
				photos.value = res.data;
			} else {
				photos.value = [
					{
						id: 0,
						id_offer: 0,
						main: true,
						path: "defaultPhoto.svg",
					},
				];
			}
		});
};

onMounted(() => {
	axios
		.get(`${import.meta.env.VITE_URL_BACK}/offers/${route.params.id}`)
		.then((res) => {
			offer.value = res.data;
		});

	getPhotos();
});
</script>
