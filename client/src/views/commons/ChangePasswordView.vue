<template>
	<div class="siteContainer">
		<ChangePasswordForm @change-password="changePassword" />
	</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import jwt_decode from "jwt-decode";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm.vue";
import type { ITokenDecoded } from "../../interfaces/ITokenDecoded";

const route = useRoute();
const router = useRouter();
let userId: number;
let requestResult = document.getElementById("requestResult");

onMounted(() => {
	const token = route.query.token as string;
	const tokenDecoded: ITokenDecoded = jwt_decode(token);
	userId = tokenDecoded.id;
	requestResult = document.getElementById("requestResult");
});

const changePassword = (password: string, confirmedPassword: string) => {
	axios
		.request({
			method: "put",
			url: `${import.meta.env.VITE_URL_BACK}/users/${userId}`,
			data: { password: password, confirmedPassword: confirmedPassword },
		})
		.then(() => {
			if (requestResult) {
				requestResult?.classList.remove("text-red-400");
				requestResult?.classList.add("text-green-400");
				requestResult.textContent = "Redirection vers la page de connection...";
			}
			setTimeout(() => {
				router.push("/auth");
			}, 3000);
		})
		.catch((err) => {
			if (requestResult) {
				requestResult?.classList.remove("text-green-400");
				requestResult?.classList.add("text-red-400");
				requestResult.textContent = err.response.data.message;
			}
		});
};
</script>
