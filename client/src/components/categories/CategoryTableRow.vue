<template>
	<tr>
		<td>{{ category.id }}</td>
		<td>
			<input
				:class="[updating ? 'bg-slate-600 text-white' : 'bg-transparent']"
				class="w-full p-1"
				type="text"
				v-model="category.name"
				:disabled="!updating"
			/>
		</td>
		<td>
			<select
				:class="[updating ? 'bg-slate-600' : 'bg-transparent']"
				class="w-full p-1"
				v-model="category.id_parent_category"
				:disabled="!updating"
			>
				<option :value="null"></option>
				<option v-for="category in categoriesList" :value="category.id">
					{{ category.name }}
				</option>
			</select>
		</td>
		<td>
			<div class="flex justify-center">
				<button @click="toggleUpdating(category)" class="btn btn-green">
					{{ updating ? "Valider" : "Modifier" }}
				</button>
			</div>
		</td>
		<td>
			<div class="flex justify-center">
				<button @click="confirmDelete(category)" class="btn btn-red">
					Supprimer
				</button>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import type { ICategoryRes } from "@/interfaces/ICategory";

interface Props {
	categoriesList: ICategoryRes[];
	category: ICategoryRes;
}

defineProps<Props>();
const emit = defineEmits<{
	(e: "requestResult", success: boolean, message: string): void;
}>();

const updating = ref(false);

const toggleUpdating = (category: ICategoryRes) => {
	if (!updating.value) {
		updating.value = true;
	} else {
		updating.value = false;
		axios
			.request({
				method: "put",
				url: `${import.meta.env.VITE_URL_BACK}/categories/${category.id}`,
				data: category,
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			})
			.then((res) => {
				emit(
					"requestResult",
					true,
					`La catégorie ${category.name} a bien été mise à jour`
				);
			})
			.catch((err) => {
				emit("requestResult", false, err.response.data.message);
			});
	}
};

const confirmDelete = (category: ICategoryRes) => {
	const confirmed = confirm(
		`Voulez-vous vraiment supprimer la race ${category.name} ?`
	);
	if (confirmed) {
		deleteCategory(category);
	}
};

const deleteCategory = (category: ICategoryRes) => {
	axios
		.delete(`${import.meta.env.VITE_URL_BACK}/categories/${category.id}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
		.then(() => {
			emit(
				"requestResult",
				true,
				`La catégorie ${category.name} a bien été supprimée`
			);
		})
		.catch((err) => {
			emit("requestResult", false, err.response.data.message);
		});
};
</script>
