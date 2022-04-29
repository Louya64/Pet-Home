<template>
	<div class="pt-[15vh] min-h-screen">
		<h1 class="text-center sm:text-2xl mb-10">
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
				<div class="form-item mt-0">
					<label for="email">Email</label>
					<input
						class="form-item-input"
						type="text"
						id="email"
						v-model="email"
					/>
				</div>
				<div class="form-item relative">
					<label for="password">Mot de passe</label>
					<input
						class="form-item-input"
						type="password"
						id="password"
						v-model="password"
					/>
					<font-awesome-icon
						@click="toggleShowPassword('password')"
						class="absolute bottom-11 right-5 dark:text-black text-lg hover:cursor-pointer"
						icon="eye-slash"
					/>
					<p @click="forgotPassword" class="self-end hover:cursor-pointer">
						Mot de passe oublié?
					</p>
				</div>
				<div class="pb-10 text-center" id="requestResul"></div>
				<div class="flex justify-end">
					<button class="btn btn-green">Se connecter</button>
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

const toggleShowPassword = (elem: string) => {
	const inputToToggle = document.getElementById(elem);
	if (inputToToggle && inputToToggle.getAttribute("type") === "password") {
		inputToToggle.setAttribute("type", "text");
	} else {
		inputToToggle?.setAttribute("type", "password");
	}
};

const login = async (credentials: any) => {
	const userAuthenticated = await axios
		.request({
			method: "post",
			url: `${import.meta.env.VITE_URL_BACK}/dashboard/auth/login`,
			data: credentials,
		})
		.then((res) => res.data)
		.catch((err) => {
			if (requestResul) {
				requestResul?.classList.remove("text-green-400");
				requestResul?.classList.add("text-red-400");
				requestResul.textContent = err.response.data.message;
			}
		});
	if (userAuthenticated) {
		localStorage.setItem("token", userAuthenticated);
		window.dispatchEvent(new Event("storage"));
		router.push("/dashboard");
	}
};

const forgotPassword = () => {
	router.push("/dashboard/forgotPasswordConfirm");
};
</script>
