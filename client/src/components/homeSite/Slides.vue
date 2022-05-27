<template>
	<carousel :autoplay="5000" :wrap-around="true">
		<slide v-for="photo in photosList" :key="photo.id">
			<div class="carousel__item w-full h-[70vh]">
				<img :src="`${urlBack}/image/${photo.path}`" alt="" />
			</div>
		</slide>

		<template #addons>
			<pagination />
		</template>
	</carousel>
</template>

<script setup lang="ts">
import { Carousel, Slide, Pagination } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import { onMounted, ref, type Ref } from "vue";
import axios from "axios";
import type { IPhoto } from "../../interfaces/IPhoto";

let photosList: Ref<IPhoto[]> = ref([]);
const urlBack = import.meta.env.VITE_URL_BACK;

const getPhotosList = () => {
	axios
		.get(`${import.meta.env.VITE_URL_BACK}/uploads?main=true`)
		.then((res) => {
			// if res.data.length > 5 => slice ?

			photosList.value = res.data;
		});
};

onMounted(() => {
	getPhotosList();
});
</script>
