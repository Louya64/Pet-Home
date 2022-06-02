<template>
	<div v-if="registered" class="siteContainer">
		<h1 class="text-center sm:text-2xl mb-10">Connection</h1>
		<p class="text-center mb-10">
			Pas encore inscrit?
			<button class="btn btn-green" @click="() => (registered = false)">
				Créer un compte
			</button>
		</p>

		<LoginForm
			@login="login"
			@forgotPassword="forgotPassword"
			:resultMessage="resultMessage"
			:requestSuccess="requestSuccess"
		/>
	</div>

	<div v-else>
		<RegistrationForm @alreadyRegistered="() => (registered = true)" />
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import jwt_decode from "jwt-decode";
import LoginForm from "@/components/auth/LoginForm.vue";
import RegistrationForm from "@/components/auth/RegistrationForm.vue";
import type { ICredentials } from "@/interfaces/ICredentials";
import type { ITokenDecoded } from "@/interfaces/ITokenDecoded";

const router = useRouter();
const registered = ref(true);
const resultMessage = ref("");
const requestSuccess = ref(false);

const login = async (credentials: ICredentials) => {
	await axios
		.request({
			method: "post",
			url: `${import.meta.env.VITE_URL_BACK}/auth/login`,
			data: credentials,
		})
		.then((res) => {
			const token = res.data;
			const user: ITokenDecoded = jwt_decode(token);
			const userRole = user.role;
			const userId = user.id;
			const userUsername = user.username;
			localStorage.setItem("token", token);
			localStorage.setItem("userId", userId.toString());
			localStorage.setItem("userRole", userRole.toString());
			localStorage.setItem("userUsername", userUsername);
			window.dispatchEvent(new Event("storage"));
			if (userRole === 1 || userRole === 2) {
				if (userRole === 1) {
				}
				router.push("/dashboard");
			} else {
				router.push("/");
			}
		})
		.catch((err) => {
			requestSuccess.value = false;
			resultMessage.value = err.response.data.message;
		});
};

const forgotPassword = () => {
	router.push("/forgotPasswordConfirm");
};
</script>
