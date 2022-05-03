<template>
	<div class="pt-[15vh] min-h-screen">
		<ForgotPasswordForm @send-link="sendLink" />
	</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import axios from "axios";
import ForgotPasswordForm from "@/components/ForgotPasswordForm.vue";

let requestResult = document.getElementById("requestResult");

onMounted(() => {
	requestResult = document.getElementById("requestResult");
});

const sendLink = (email: string) => {
	axios
		.request({
			method: "post",
			url: `${import.meta.env.VITE_URL_BACK}/forgotPassword`,
			data: { email: email },
		})
		.then(() => {
			if (requestResult) {
				requestResult?.classList.remove("text-red-400");
				requestResult?.classList.add("text-green-400");
				requestResult.textContent =
					"Un email vous a été envoyé avec un lien pour changer de mot de passe (cela peut prendre quelques minutes)";
			}
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
