<template>
	<h1 class="text-center sm:text-2xl my-20">
		S'identifier pour accéder à Pet'Home dashboard
	</h1>
	<div class="lg:flex lg:flex-row-reverse px-20">
		<div
			class="lg:w-1/2 text-white text-center lg:p-20 sm:px-20 sm:py-10 px-10 py-5"
		>
			<button class="btn btn-blue text-xs xs:text-base">
				Se connecter avec facebook
			</button>
		</div>
		<form class="form lg:w-1/2" @submit.prevent="login({ email, password })">
			<div class="form-item">
				<label for="email">Email</label>
				<input class="form-item-input" type="text" id="email" v-model="email" />
			</div>
			<div class="form-item">
				<label for="password">Mot de passe</label>
				<input
					class="form-item-input"
					type="text"
					id="password"
					v-model="password"
				/>
				<p class="self-end">Mot de passe oublié?</p>
			</div>
			<div class="flex justify-end">
				<button class="btn btn-green">Se connecter</button>
			</div>
		</form>
	</div>
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
