<template>
	<h1 class="text-center sm:text-2xl my-20">
		Vous avez oublié votre mot de passe
	</h1>
	<p class="text-center">
		Un email va vous être envoyé pour pouvoir changer de mot de passe
	</p>
	<div class="px-20">
		<form class="form lg:w-1/2 mx-auto" @submit.prevent="forgotPassword(email)">
			<div class="form-item">
				<label for="email">Email</label>
				<input class="form-item-input" type="text" id="email" v-model="email" />
			</div>
			<div class="pb-10 text-center" id="requestResul"></div>
			<div class="flex justify-end">
				<button class="btn btn-green">Valider</button>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import axios from "axios";

const email = ref("");
let requestResul = document.getElementById("requestResul");

onMounted(() => {
	requestResul = document.getElementById("requestResul");
});

watch(email, () => {
	if (requestResul) {
		requestResul.textContent = "";
	}
});

const forgotPassword = (email: string) => {
	axios
		.request({
			method: "post",
			url: `${import.meta.env.VITE_URL_BACK}/forgotPassword`,
			data: { email: email },
		})
		.then(() => {
			if (requestResul) {
				requestResul?.classList.remove("text-red-400");
				requestResul?.classList.add("text-green-400");
				requestResul.textContent =
					"Un email vous a été envoyé avec un lien pour changer de mot de passe";
			}
		})
		.catch((err) => {
			if (requestResul) {
				requestResul?.classList.remove("text-green-400");
				requestResul?.classList.add("text-red-400");
				requestResul.textContent = err.response.data.message;
			}
		});
};
</script>
