<template>
	<h1>S'identifier pour accédes à Pet'Home dashboard</h1>
	<form action="" @submit.prevent="login({ email, password })">
		<div>
			<label for="email">Email</label>
			<input type="text" id="email" v-model="email" />
		</div>
		<div>
			<label for="password">Mot de passe</label>
			<input type="text" id="password" v-model="password" />
		</div>
		<button>Se connecter</button>
	</form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const email = ref("");
const password = ref("");

const login = async (credentials: any) => {
	const userAuthenticated = await axios
		.request({
			method: "post",
			url: `http://localhost:8080/dashboard/auth/login`,
			data: credentials,
		})
		.then((res) => res.data);
	if (userAuthenticated) {
		localStorage.setItem("token", userAuthenticated);
		window.dispatchEvent(new Event("storage"));
		router.push("/dashboard");
	}
};
</script>
