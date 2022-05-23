<template>
	<tr>
		<td>{{ race.id }}</td>
		<td>
			<input
				:class="[updating ? 'bg-slate-600 text-white' : 'bg-transparent']"
				class="w-full p-1"
				type="text"
				v-model="race.name"
				:disabled="!updating"
			/>
		</td>
		<td>
			<select
				:class="[updating ? 'bg-slate-600' : 'bg-transparent']"
				class="w-full p-1"
				v-model="race.id_category"
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
				<button @click="toggleUpdating(race)" class="btn btn-green">
					{{ updating ? "Valider" : "Modifier" }}
				</button>
			</div>
		</td>
		<td>
			<div class="flex justify-center">
				<button @click="confirmDelete(race)" class="btn btn-red">
					Supprimer
				</button>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import type { IRaceRes } from "@/interfaces/IRace";
import type { ICategoryRes } from "@/interfaces/ICategory";

interface Props {
	categoriesList: ICategoryRes[];
	race: IRaceRes;
}

defineProps<Props>();
const emit = defineEmits<{
	(e: "requestResult", success: boolean, message: string): void;
}>();

const updating = ref(false);

const toggleUpdating = (race: IRaceRes) => {
	if (!updating.value) {
		updating.value = true;
	} else {
		updating.value = false;
		axios
			.request({
				method: "put",
				url: `${import.meta.env.VITE_URL_BACK}/races/${race.id}`,
				data: race,
			})
			.then((res) => {
				emit(
					"requestResult",
					true,
					`La race ${race.name} a bien été mise à jour`
				);
			})
			.catch((err) => {
				emit("requestResult", false, err.response.data.message);
			});
	}
};

const confirmDelete = (race: IRaceRes) => {
	const confirmed = confirm(
		`Voulez-vous vraiment supprimer la race ${race.name} ?`
	);
	if (confirmed) {
		deleteRace(race);
	}
};

const deleteRace = (race: IRaceRes) => {
	axios
		.delete(`${import.meta.env.VITE_URL_BACK}/races/${race.id}`)
		.then(() => {
			emit("requestResult", true, `La race ${race.name} a bien été supprimée`);
		})
		.catch((err) => {
			emit("requestResult", false, err.response.data.message);
		});
};
</script>
