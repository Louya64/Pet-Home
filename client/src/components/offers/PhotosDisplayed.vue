<template>
	<div v-if="photosDisplayed" class="overflow-hidden relative px-10">
		<div class="flex h-[150px] justify-center">
			<div
				v-for="photo in photosDisplayed"
				class="max-w-[250px] flex justify-center items-center p-5 relative"
				:class="[photo.main && isAdmin ? 'border-amber-300 border-8' : '']"
			>
				<img
					:class="isAdmin ? 'hover:cursor-pointer hover:scale-105' : ''"
					width="250"
					:src="`${urlBack}/image/${photo.path}`"
					:alt="category"
					:title="isAdmin ? 'Choisir comme photo principale' : ''"
					@click="isAdmin ? updateMainPhoto(photo.id) : ''"
				/>
				<font-awesome-icon
					v-if="isAdmin"
					class="mt-1 bg-red-500/75 rounded-full px-1 hover:cursor-pointer absolute right-2 top-2 text-white text-sm"
					icon="xmark"
					title="Supprimer la photo"
					@click="deletePhoto(photo.id)"
				/>
			</div>
		</div>
		<font-awesome-icon
			v-if="photos && photos.length > nbPhotosDisplayed"
			class="mt-1 bg-slate-500/75 rounded-full py-3 px-4 hover:cursor-pointer absolute right-0 top-[50px] text-white text-2xl"
			icon="chevron-right"
			@click="scrollPhotos(1)"
		/>
		<font-awesome-icon
			v-if="photos && photos.length > nbPhotosDisplayed"
			class="mt-1 bg-slate-500/75 rounded-full py-3 px-4 hover:cursor-pointer absolute left-0 top-[50px] text-white text-2xl"
			icon="chevron-left"
			@click="scrollPhotos(-1)"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, type Ref, computed } from "vue";
import type { IPhoto } from "@/interfaces/IPhoto";
import axios from "axios";

interface Props {
	offerId: number;
	offerCategory: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(e: "photosEmpty"): void;
}>();
const urlBack = import.meta.env.VITE_URL_BACK;
const category = ref(props.offerCategory);
const photos: Ref<IPhoto[] | undefined> = ref();
const firstPhotoIndex = ref(0);
const nbPhotosDisplayed = 6;
let mainPhotoId: null | number = null;
const isAdmin =
	localStorage.getItem("userRole") === "1" ||
	localStorage.getItem("userRole") === "2";

const photosDisplayed = computed(() => {
	if (photos.value) {
		if (photos.value.length <= nbPhotosDisplayed) {
			firstPhotoIndex.value = 0;
		}
		return photos.value.slice(
			firstPhotoIndex.value,
			firstPhotoIndex.value + nbPhotosDisplayed
		);
	}
});

const getPhotos = () => {
	mainPhotoId = null;

	axios
		.get(`${import.meta.env.VITE_URL_BACK}/uploads?id_offer=${props.offerId}`)
		.then((res) => {
			if (res.data.length) {
				photos.value = res.data;
				mainPhotoId = res.data.filter((photo: IPhoto) => photo.main)[0].id;
			} else {
				emit("photosEmpty");
			}
		});
};

const scrollPhotos = (nb: number) => {
	if (photos.value) {
		if (
			firstPhotoIndex.value + nb + 6 > photos.value.length ||
			firstPhotoIndex.value + nb < 0
		) {
			return;
		}
		firstPhotoIndex.value += nb;
	}
};

const updatePhoto = async (id: number, main: boolean) => {
	await axios.request({
		method: "put",
		url: `${import.meta.env.VITE_URL_BACK}/uploads/${id}`,
		data: { main: main },
	});
};

const updateMainPhoto = async (id: number) => {
	if (mainPhotoId) {
		await updatePhoto(mainPhotoId, false);
	}
	await updatePhoto(id, true);
	getPhotos();
};

const deletePhoto = (id: number) => {
	axios.delete(`${import.meta.env.VITE_URL_BACK}/uploads/${id}`).then(() => {
		getPhotos();
	});
};

onMounted(() => {
	getPhotos();
});
</script>
