<template>
	<tr>
		<td>{{ adoptionStatus.id }}</td>
		<td>
			<input
				:class="[updating ? 'bg-slate-600 text-white' : 'bg-transparent']"
				class="w-full p-1"
				type="text"
				v-model="adoptionStatus.name"
				:disabled="!updating"
			/>
		</td>
		<td>
			<div class="flex justify-center">
				<button @click="toggleUpdating(adoptionStatus)" class="btn btn-green">
					{{ updating ? "Valider" : "Modifier" }}
				</button>
			</div>
		</td>
		<td>
			<div class="flex justify-center">
				<button @click="confirmDelete(adoptionStatus)" class="btn btn-red">
					Supprimer
				</button>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import type { IAdoptionStatusRes } from "@/interfaces/IAdoptionStatus";
interface Props {
	adoptionStatus: IAdoptionStatusRes;
}
defineProps<Props>();
const emit = defineEmits<{
	(e: "requestResult", success: boolean, message: string): void;
}>();
const updating = ref(false);
const toggleUpdating = (adoptionStatus: IAdoptionStatusRes) => {
	if (!updating.value) {
		updating.value = true;
	} else {
		updating.value = false;
		axios
			.request({
				method: "put",
				url: `${import.meta.env.VITE_URL_BACK}/adoptionStatus/${
					adoptionStatus.id
				}`,
				data: adoptionStatus,
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			})
			.then(() => {
				emit(
					"requestResult",
					true,
					`Le statut ${adoptionStatus.name} a bien été mis à jour`
				);
			})
			.catch((err) => {
				emit("requestResult", false, err.response.data.message);
			});
	}
};
const confirmDelete = (adoptionStatus: IAdoptionStatusRes) => {
	const confirmed = confirm(
		`Voulez-vous vraiment supprimer le rôle ${adoptionStatus.name} ?`
	);
	if (confirmed) {
		deleteAdoptionStatus(adoptionStatus);
	}
};
const deleteAdoptionStatus = (adoptionStatus: IAdoptionStatusRes) => {
	axios
		.delete(
			`${import.meta.env.VITE_URL_BACK}/adoptionStatus/${adoptionStatus.id}`,
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}
		)
		.then(() => {
			emit(
				"requestResult",
				true,
				`Le statut ${adoptionStatus.name} a bien été supprimé`
			);
		})
		.catch((err) => {
			emit("requestResult", false, err.response.data.message);
		});
};
</script>
