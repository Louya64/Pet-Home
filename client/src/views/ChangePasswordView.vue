<template>
	<div class="pt-[15vh] min-h-screen">
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
				<div class="pb-10 text-center" id="requestResult"></div>
				<div class="flex justify-end">
					<button class="btn btn-green">Valider</button>
				</div>
			</form>
		</div>
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
let requestResult = document.getElementById("requestResult");

onMounted(() => {
	const token = route.query.token as string;
	const tokenDecoded: ITokenDecoded = jwt_decode(token);
	userId = tokenDecoded.id;
	requestResult = document.getElementById("requestResult");
});

watch(password, () => {
	if (requestResult) {
		requestResult.textContent = "";
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
			if (requestResult) {
				requestResult?.classList.remove("text-red-400");
				requestResult?.classList.add("text-green-400");
				requestResult.textContent =
					"Mot de passe enregistré, redirection vers la page de connection...";
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
