<template>
	<form
		class="form flex justify-between items-end w-1/2 mx-auto"
		@submit.prevent="addOfferStatus(createOfferStatusName)"
	>
		<div class="form-item">
			<label for="offerStatusName"
				><font-awesome-icon class="text-red-500 text-xs" icon="asterisk" />
				Nom</label
			>
			<input
				required
				class="form-item-input"
				type="text"
				id="offerStatusName"
				v-model="createOfferStatusName"
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
const createOfferStatusName = ref("");
const addOfferStatus = (offerStatusName: string) => {
	axios
		.request({
			method: "post",
			url: `${import.meta.env.VITE_URL_BACK}/offerStatus`,
			data: {
				name: offerStatusName,
			},
		})
		.then(() => {
			emit(
				"requestResult",
				true,
				`Le statut ${offerStatusName} a bien été crée`
			);
			createOfferStatusName.value = "";
		})
		.catch((err) => {
			emit("requestResult", false, err.response.data.message);
		});
};
</script>
