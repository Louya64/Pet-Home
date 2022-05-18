<template>
	<div class="siteContainer">
		<ChangePasswordForm
			@change-password="changePassword"
			:resultMessage="resultMessage"
			:requestSuccess="requestSuccess"
		/>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import jwt_decode from "jwt-decode";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm.vue";
import type { ITokenDecoded } from "@/interfaces/ITokenDecoded";

const route = useRoute();
const router = useRouter();
let userId: number;
const resultMessage = ref("");
const requestSuccess = ref(false);

onMounted(() => {
	const token = route.query.token as string;
	const tokenDecoded: ITokenDecoded = jwt_decode(token);
	userId = tokenDecoded.id;
});

const changePassword = (password: string, confirmedPassword: string) => {
	axios
		.request({
			method: "put",
			url: `${import.meta.env.VITE_URL_BACK}/users/${userId}`,
			data: { password: password, confirmedPassword: confirmedPassword },
		})
		.then(() => {
			requestSuccess.value = true;
			resultMessage.value = "Redirection vers la page de connection...";
			setTimeout(() => {
				router.push("/auth");
			}, 3000);
		})
		.catch((err) => {
			requestSuccess.value = false;
			resultMessage.value = err.response.data.message;
		});
};
</script>
