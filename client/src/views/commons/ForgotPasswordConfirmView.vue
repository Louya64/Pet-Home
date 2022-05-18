<template>
	<div class="siteContainer">
		<ForgotPasswordForm
			@send-link="sendLink"
			:resultMessage="resultMessage"
			:requestSuccess="requestSuccess"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm.vue";

const resultMessage = ref("");
const requestSuccess = ref(false);

const sendLink = (email: string) => {
	axios
		.request({
			method: "post",
			url: `${import.meta.env.VITE_URL_BACK}/forgotPassword`,
			data: { email: email },
		})
		.then(() => {
			requestSuccess.value = true;
			resultMessage.value =
				"Un email vous a été envoyé avec un lien pour changer de mot de passe (cela peut prendre quelques minutes)";
		})
		.catch((err) => {
			requestSuccess.value = false;
			resultMessage.value = err.response.data.message;
		});
};
</script>
