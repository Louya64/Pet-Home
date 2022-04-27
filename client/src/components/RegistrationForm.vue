<template>
	<div class="pt-[15vh] min-h-screen">
		<h1 class="text-center sm:text-2xl mb-20">Création d'un compte</h1>
		<div class="lg:flex lg:flex-row-reverse px-20">
			<div class="lg:w-1/2 text-center lg:p-20 sm:px-20 sm:py-10 px-10 py-5">
				<button class="btn btn-blue text-xs xs:text-base">
					Créer un compte avec facebook
				</button>
			</div>
			<form
				class="form lg:w-1/2"
				@submit.prevent="
					register({
						email,
						password,
						username,
						firstname,
						lastname,
						phone_number,
					})
				"
			>
				<div class="form-item mt-0">
					<label for="email">Email</label>
					<input
						class="form-item-input"
						type="email"
						id="email"
						v-model="email"
					/>
				</div>
				<div class="form-item">
					<label for="password">Mot de passe</label>
					<input
						class="form-item-input"
						type="text"
						id="password"
						v-model="password"
					/>
				</div>
				<div class="form-item">
					<label for="username">Pseudonyme</label>
					<input
						class="form-item-input"
						type="text"
						id="username"
						v-model="username"
					/>
				</div>
				<div class="form-item">
					<label for="firstname">Prénom</label>
					<input
						class="form-item-input"
						type="text"
						id="firstname"
						v-model="firstname"
					/>
				</div>
				<div class="form-item">
					<label for="lastname">Nom de famille</label>
					<input
						class="form-item-input"
						type="text"
						id="lastname"
						v-model="lastname"
					/>
				</div>
				<div class="form-item">
					<label for="phone_number">Numéro de téléphone</label>
					<input
						class="form-item-input"
						type="text"
						id="phone_number"
						v-model="phone_number"
					/>
				</div>
				<div class="pb-10 text-center" id="requestResult"></div>
				<div class="flex justify-end">
					<button class="btn btn-green">Créer le compte</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const email = ref("");
const password = ref("");
const username = ref("");
const firstname = ref("");
const lastname = ref("");
const phone_number = ref("");
let requestResult = document.getElementById("requestResult");

onMounted(() => {
	requestResult = document.getElementById("requestResult");
});

watch(email, () => {
	if (requestResult) {
		requestResult.textContent = "";
	}
});

watch(password, () => {
	if (requestResult) {
		requestResult.textContent = "";
	}
});

watch(username, () => {
	if (requestResult) {
		requestResult.textContent = "";
	}
});

watch(firstname, () => {
	if (requestResult) {
		requestResult.textContent = "";
	}
});

watch(lastname, () => {
	if (requestResult) {
		requestResult.textContent = "";
	}
});

watch(phone_number, () => {
	if (requestResult) {
		requestResult.textContent = "";
	}
});

const register = async (userData: any) => {
	await axios
		.request({
			method: "post",
			url: `${import.meta.env.VITE_URL_BACK}/auth/register`,
			data: userData,
		})
		.then((res) => {
			if (requestResult) {
				requestResult?.classList.add("text-green-400");
				requestResult?.classList.remove("text-red-400");
				requestResult.textContent = "Votre compte a bien été enregistré";
			}
			localStorage.setItem("token", res.data);
			window.dispatchEvent(new Event("storage"));
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
