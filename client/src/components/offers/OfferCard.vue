<template>
	<div
		v-if="offer.status.name !== 'Clos'"
		@click="() => router.push('/offers/' + offer.id)"
		class="w-1/4 m-5 p-3 flex flex-col justify-between shadow-md shadow-slate-700 hover:cursor-pointer hover:scale-105 transition duration-300 hover:shadow-2xl hover:shadow-slate-700"
	>
		<div v-if="photo">
			<img class="w-2/3 mx-auto" :src="`${urlBack}/image/${photo}`" alt="" />
		</div>
		<div>
			<div class="flex justify-evenly text-xs">
				<div>
					{{ offer.status.name }}
				</div>
				<div>Annonce n°: {{ offer.id }}</div>
			</div>
			<h2 class="text-center text-xl my-3">
				{{
					offer.animal_name
						? offer.animal_name.length > 10
							? offer.animal_name.slice(0, 10) + "..."
							: offer.animal_name
						: "" || offer.category.name
				}}
				{{
					offer.age / 12 > 2
						? Math.round(offer.age / 12) + " ans"
						: offer.age + " mois"
				}}
			</h2>
			<div class="text-center">
				{{
					offer.description
						? offer.description.length > 50
							? offer.description.slice(0, 50) + "..."
							: offer.description
						: ""
				}}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import axios from "axios";
import { onBeforeMount, ref, computed, onBeforeUpdate } from "vue";
import { useRouter } from "vue-router";

interface IOffer {
	id: number;
	creation_date: string;
	adoption_date: string | null;
	status: {
		name: string;
	};
	animal_name: string;
	age: number;
	category: {
		name: string;
	};
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
interface Props {
	offer: IOffer;
}
interface IUpload {
	id: number;
	id_offer: number;
	path: string;
	main: boolean;
}
const props = defineProps<Props>();
const router = useRouter();
const urlBack = import.meta.env.VITE_URL_BACK;
const photo = ref();
const defaultPhotoPath = "defaultPhoto.svg";

const getMainPhoto = async () => {
	await axios
		.get(`${import.meta.env.VITE_URL_BACK}/uploads?id_offer=${props.offer.id}`)
		.then((res) => {
			if (res.data) {
				const mainPhoto = res.data.filter((photo: IUpload) => photo.main);
				photo.value = mainPhoto[0].path;
			}
		})
		.catch(() => {
			photo.value = defaultPhotoPath;
		});
};

onBeforeMount(() => {
	getMainPhoto();
});
onBeforeUpdate(() => {
	getMainPhoto();
});
</script>
