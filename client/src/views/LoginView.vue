<template>
	<div v-if="registered" class="pt-[15vh] min-h-screen">
		<h1 class="text-center sm:text-2xl mb-20">Déjà inscrit ? Connectez-vous</h1>
		<div class="lg:flex lg:flex-row-reverse px-20">
			<div
				class="lg:w-1/2 text-white text-center lg:p-20 sm:px-20 sm:py-10 px-10 py-5"
			>
				<button class="btn btn-blue text-xs xs:text-base">
					Se connecter avec facebook
				</button>
			</div>
			<form class="form lg:w-1/2" @submit.prevent="login({ email, password })">
				<div class="form-item mt-0">
					<label for="email">Email</label>
					<input
						class="form-item-input"
						type="email"
						required
						id="email"
						v-model="email"
					/>
				</div>
				<div class="form-item">
					<label for="password">Mot de passe</label>
					<input
						class="form-item-input"
						type="password"
						required
						id="password"
						v-model="password"
					/>
					<p @click="forgotPassword" class="self-end hover:cursor-pointer">
						Mot de passe oublié?
					</p>
				</div>
				<div class="pb-10 text-center text-red-400" id="requestResul"></div>
				<div class="flex justify-end">
					<button class="btn btn-green">Se connecter</button>
				</div>
			</form>
		</div>
		<div class="sm:text-2xl text-center">
			Pas encore inscrit?
			<button class="btn btn-green" @click="() => (registered = false)">
				Créez un compte
			</button>
		</div>
	</div>

	<div v-else>
		<RegistrationForm />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import RegistrationForm from "../components/RegistrationForm.vue";

const router = useRouter();
const registered = ref(true);
const email = ref("");
const password = ref("");
let requestResul = document.getElementById("requestResul");

onMounted(() => {
	requestResul = document.getElementById("requestResul");
});

watch(email, () => {
	if (requestResul) {
		requestResul.textContent = "";
	}
});

watch(password, () => {
	if (requestResul) {
		requestResul.textContent = "";
	}
});

const login = async (credentials: any) => {
	await axios
		.request({
			method: "post",
			url: `${import.meta.env.VITE_URL_BACK}/auth/login`,
			data: credentials,
		})
		.then((res) => {
			localStorage.setItem("token", res.data);
			window.dispatchEvent(new Event("storage"));
			router.push("/");
		})
		.catch((err) => {
			if (requestResul) {
				requestResul.textContent = err.response.data.message;
			}
		});
};

const forgotPassword = () => {
	router.push("forgotPasswordConfirm");
};
</script>
