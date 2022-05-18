<template>
	<form
		class="form flex justify-between items-end w-3/4 mx-auto"
		@submit.prevent="addCategory(createCategoryName, idParentCategory)"
	>
		<div class="form-item">
			<label for="categoryName"
				><font-awesome-icon class="text-red-500 text-xs" icon="asterisk" />
				Nom</label
			>
			<input
				required
				class="form-item-input"
				type="text"
				id="categoryName"
				v-model="createCategoryName"
			/>
		</div>
		<div class="form-item">
			<label for="parentCategory"> Catégorie Parente (optionnel)</label>
			<select class="form-item-input" v-model="idParentCategory">
				<option v-for="category in categoriesList" :value="category.id">
					{{ category.name }}
				</option>
			</select>
		</div>
		<div class="form-item ml-16 pb-3">
			<button class="btn btn-green">Ajouter une catégorie</button>
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

const createCategoryName = ref("");
const idParentCategory = ref();

const addCategory = (categoryName: string, categoryParent: number) => {
	axios
		.request({
			method: "post",
			url: `${import.meta.env.VITE_URL_BACK}/categories`,
			data: {
				name: categoryName,
				id_parent_category: categoryParent,
			},
		})
		.then((res) => {
			emit(
				"requestResult",
				true,
				`La catégorie ${categoryName} a bien été crée`
			);
			createCategoryName.value = "";
			idParentCategory.value = null;
		})
		.catch((err) => {
			emit("requestResult", false, err.response.data.message);
		});
};
</script>
