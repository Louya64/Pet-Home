<template>
	<form
		class="form flex justify-between items-end w-1/2 mx-auto"
		@submit.prevent="addUserRole(createUserRoleName)"
	>
		<div class="form-item">
			<label for="userRoleName"
				><font-awesome-icon class="text-red-500 text-xs" icon="asterisk" />
				Nom</label
			>
			<input
				required
				class="form-item-input"
				type="text"
				id="userRoleName"
				v-model="createUserRoleName"
			/>
		</div>
		<div class="form-item ml-16 pb-3">
			<button class="btn btn-green">Ajouter une rôle</button>
		</div>
	</form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const emit = defineEmits<{
	(e: "requestResult", success: boolean, message: string): void;
}>();

const createUserRoleName = ref("");

const addUserRole = (userRoleName: string) => {
	axios
		.request({
			method: "post",
			url: `${import.meta.env.VITE_URL_BACK}/roles`,
			data: {
				name: userRoleName,
			},
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
		.then(() => {
			emit("requestResult", true, `Le rôle ${userRoleName} a bien été crée`);
			createUserRoleName.value = "";
		})
		.catch((err) => {
			emit("requestResult", false, err.response.data.message);
		});
};
</script>
