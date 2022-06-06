<template>
	<tr>
		<td>{{ offerStatus.id }}</td>
		<td>
			<input
				:class="[updating ? 'bg-slate-600 text-white' : 'bg-transparent']"
				class="w-full p-1"
				type="text"
				v-model="offerStatus.name"
				:disabled="!updating"
			/>
		</td>
		<td>
			<div class="flex justify-center">
				<button @click="toggleUpdating(offerStatus)" class="btn btn-green">
					{{ updating ? "Valider" : "Modifier" }}
				</button>
			</div>
		</td>
		<td>
			<div class="flex justify-center">
				<button @click="confirmDelete(offerStatus)" class="btn btn-red">
					Supprimer
				</button>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import type { IOfferStatusRes } from "@/interfaces/IOfferStatus";
interface Props {
	offerStatus: IOfferStatusRes;
}
defineProps<Props>();
const emit = defineEmits<{
	(e: "requestResult", success: boolean, message: string): void;
}>();
const updating = ref(false);
const toggleUpdating = (offerStatus: IOfferStatusRes) => {
	if (!updating.value) {
		updating.value = true;
	} else {
		updating.value = false;
		axios
			.request({
				method: "put",
				url: `${import.meta.env.VITE_URL_BACK}/offerStatus/${offerStatus.id}`,
				data: offerStatus,
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			})
			.then((res) => {
				emit(
					"requestResult",
					true,
					`Le statut ${offerStatus.name} a bien été mis à jour`
				);
			})
			.catch((err) => {
				emit("requestResult", false, err.response.data.message);
			});
	}
};
const confirmDelete = (offerStatus: IOfferStatusRes) => {
	const confirmed = confirm(
		`Voulez-vous vraiment supprimer le rôle ${offerStatus.name} ?`
	);
	if (confirmed) {
		deleteOfferStatus(offerStatus);
	}
};
const deleteOfferStatus = (offerStatus: IOfferStatusRes) => {
	axios
		.delete(`${import.meta.env.VITE_URL_BACK}/offerStatus/${offerStatus.id}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
		.then(() => {
			emit(
				"requestResult",
				true,
				`Le statut ${offerStatus.name} a bien été supprimé`
			);
		})
		.catch((err) => {
			emit("requestResult", false, err.response.data.message);
		});
};
</script>
