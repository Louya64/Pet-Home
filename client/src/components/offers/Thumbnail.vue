<template>
	<img
		v-if="photo"
		width="30"
		class="max-w-[30px]"
		:src="`${urlBack}/image/${photo}`"
		:alt="alt"
	/>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { IPhoto } from "../../interfaces/IPhoto";
import axios from "axios";

interface Props {
	id_offer: number;
	alt: string;
}

const props = defineProps<Props>();
const urlBack = import.meta.env.VITE_URL_BACK;
const photo = ref();
const defaultPhotoPath = "defaultPhoto.svg";

onMounted(() => {
	axios
		.get(`${import.meta.env.VITE_URL_BACK}/uploads?id_offer=${props.id_offer}`)
		.then((res) => {
			if (res.data) {
				const mainPhoto = res.data.filter((photo: IPhoto) => photo.main);
				photo.value = mainPhoto[0].path;
			}
		})
		.catch(() => {
			photo.value = defaultPhotoPath;
		});
});
</script>
