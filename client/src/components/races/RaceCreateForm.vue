<template>
	<form
		class="form flex justify-between items-end w-3/4 mx-auto"
		@submit.prevent="addRace(createRaceName, idCategory)"
	>
		<div class="form-item">
			<label for="raceName"
				><font-awesome-icon class="text-red-500 text-xs" icon="asterisk" />
				Nom</label
			>
			<input
				required
				class="form-item-input"
				type="text"
				id="raceName"
				v-model="createRaceName"
			/>
		</div>
		<div class="form-item">
			<label
				><font-awesome-icon class="text-red-500 text-xs" icon="asterisk" />
				Catégorie</label
			>
			<select class="form-item-input" v-model="idCategory" required>
				<option v-for="category in categoriesList" :value="category.id">
					{{ category.name }}
				</option>
			</select>
		</div>
		<div class="form-item ml-16 pb-3">
			<button class="btn btn-green">Ajouter une race</button>
		</div>
	</form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import type { ICategoryRes } from "@/interfaces/ICategory";

interface Props {
	categoriesList: ICategoryRes[];
}

defineProps<Props>();
const emit = defineEmits<{
	(e: "requestResult", success: boolean, message: string): void;
}>();

const createRaceName = ref("");
const idCategory = ref();

const addRace = (raceName: string, category: number) => {
	axios
		.request({
			method: "post",
			url: `${import.meta.env.VITE_URL_BACK}/races`,
			data: {
				name: raceName,
				id_category: category,
			},
		})
		.then((res) => {
			emit("requestResult", true, `La catégorie ${raceName} a bien été crée`);
			createRaceName.value = "";
			idCategory.value = null;
		})
		.catch((err) => {
			emit("requestResult", false, err.response.data.message);
		});
};
</script>
