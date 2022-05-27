<template>
	<form
		class="form flex justify-between items-end w-1/2 mx-auto"
		@submit.prevent="addAdoptionStatus(createAdoptionStatusName)"
	>
		<div class="form-item">
			<label for="adoptionStatusName"
				><font-awesome-icon class="text-red-500 text-xs" icon="asterisk" />
				Nom</label
			>
			<input
				required
				class="form-item-input"
				type="text"
				id="adoptionStatusName"
				v-model="createAdoptionStatusName"
			/>
		</div>
		<div class="form-item ml-16 pb-3">
			<button class="btn btn-green">Ajouter un statut</button>
		</div>
	</form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
const emit = defineEmits<{
	(e: "requestResult", success: boolean, message: string): void;
}>();
const createAdoptionStatusName = ref("");
const addAdoptionStatus = (adoptionStatusName: string) => {
	axios
		.request({
			method: "post",
			url: `${import.meta.env.VITE_URL_BACK}/adoptionStatus`,
			data: {
				name: adoptionStatusName,
			},
		})
		.then(() => {
			emit(
				"requestResult",
				true,
				`Le statut ${adoptionStatusName} a bien été crée`
			);
			createAdoptionStatusName.value = "";
		})
		.catch((err) => {
			emit("requestResult", false, err.response.data.message);
		});
};
</script>
