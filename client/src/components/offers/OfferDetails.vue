<template>
	<div v-if="offer" class="siteContainer w-1/2 mx-auto">
		<h1>
			{{ offer.animal_name ? offer.animal_name + " , " : "" }}
			{{ offer.race ? offer.race.name : offer.category.name }} de
			{{
				offer.age / 12 > 2
					? Math.round(offer.age / 12) + " ans"
					: offer.age + " mois"
			}}
		</h1>
		<h2 class="text-center mb-10">Statut: {{ offer.status.name }}</h2>

		<div v-if="photosDisplayed" class="overflow-hidden relative px-10">
			<div class="flex h-[150px]">
				<div
					v-for="photo in photosDisplayed"
					class="max-w-[250px] flex justify-center items-center p-5"
				>
					<img
						class="hover:cursor-pointer hover:scale-105"
						width="250"
						:src="`${urlBack}/image/${photo.path}`"
						:alt="offer?.category.name"
					/>
				</div>
			</div>
			<font-awesome-icon
				class="mt-1 bg-slate-500/75 rounded-full py-3 px-4 hover:cursor-pointer absolute right-0 top-[50px] text-white text-2xl"
				icon="chevron-right"
				@click="scrollPhotos(1)"
			/>
			<font-awesome-icon
				class="mt-1 bg-slate-500/75 rounded-full py-3 px-4 hover:cursor-pointer absolute left-0 top-[50px] text-white text-2xl"
				icon="chevron-left"
				@click="scrollPhotos(-1)"
			/>
		</div>

		<div class="my-10">
			<p>Localisation : {{ offer.zipcode }} {{ offer.city }}</p>
			<p>
				{{
					offer.description
						? offer.description
						: "Pas de description pour cette annonce"
				}}
			</p>
			<p>Identifié(e): {{ offer.identified ? "oui" : "non" }}</p>
			<p>Vacciné(e): {{ offer.vaccinated ? "oui" : "non" }}</p>
			<p>
				Handicapé(e):
				{{ offer.disabled ? "oui (" + offer.disability + ")" : "non" }}
			</p>
		</div>
		<div class="flex justify-end w-5/6 mx-auto">
			<button
				@click="() => router.push(`/adoptionRequest/${route.params.id}`)"
				class="btn btn-green"
			>
				Candidature d'adoption
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, onMounted, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { IOfferRes } from "@/interfaces/IOffer";
import type { IPhoto } from "@/interfaces/IPhoto";

const route = useRoute();
const router = useRouter();
const urlBack = import.meta.env.VITE_URL_BACK;
const offer: Ref<IOfferRes | undefined> = ref();
const photos: Ref<IPhoto[] | undefined> = ref();
const photosDisplayed = ref();
let firstPhotoIndex = 0;

const scrollPhotos = (nb: number) => {
	if (photos.value) {
		photosDisplayed.value = photos.value;
		if (
			firstPhotoIndex + nb + 4 > photos.value.length ||
			firstPhotoIndex + nb < 0
		) {
			return;
		}
		firstPhotoIndex += nb;
		photosDisplayed.value = photos.value.slice(
			firstPhotoIndex,
			firstPhotoIndex + 4
		);
	}
};

onMounted(async () => {
	axios
		.get(`${import.meta.env.VITE_URL_BACK}/offers/${route.params.id}`)
		.then((res) => {
			offer.value = res.data;
		});

	await axios
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

	scrollPhotos(0);
});
</script>
