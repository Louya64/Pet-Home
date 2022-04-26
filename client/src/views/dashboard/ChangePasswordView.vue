<template>
	<h1 class="text-center sm:text-2xl my-20">Changez votre mot de passe</h1>
	<div class="px-20">
		<form
			class="form lg:w-1/2 mx-auto"
			@submit.prevent="changePassword(password)"
		>
			<div class="form-item">
				<label for="password">Nouveau mot de passe</label>
				<input
					class="form-item-input"
					type="password"
					id="password"
					v-model="password"
				/>
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
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import jwt_decode from "jwt-decode";

interface ITokenDecoded {
	id: number;
	id_role: number;
	iat: number;
}

const route = useRoute();
const router = useRouter();
const password = ref("");
let userId: number;
let requestResul = document.getElementById("requestResul");

onMounted(() => {
	const token = route.query.token as string;
	const tokenDecoded: ITokenDecoded = jwt_decode(token);
	userId = tokenDecoded.id;
	requestResul = document.getElementById("requestResul");
});

watch(password, () => {
	if (requestResul) {
		requestResul.textContent = "";
	}
});

const changePassword = (password: string) => {
	axios
		.request({
			method: "put",
			url: `${import.meta.env.VITE_URL_BACK}/users/${userId}`,
			data: { password: password },
		})
		.then(() => {
			if (requestResul) {
				requestResul?.classList.remove("text-red-400");
				requestResul?.classList.add("text-green-400");
				requestResul.textContent = "Redirection vers la page de connection...";
			}
			setTimeout(() => {
				router.push("/dashboard/login");
			}, 3000);
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
