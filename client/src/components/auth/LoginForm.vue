<template>
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
				<input class="form-item-input" type="text" id="email" v-model="email" />
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
					v-if="showPassword"
					icon="eye-slash"
					class="absolute bottom-11 right-5 dark:text-black text-lg hover:cursor-pointer"
					@click="toggleShowPassword('password')"
				/>
				<font-awesome-icon
					v-else
					icon="eye"
					class="absolute bottom-11 right-5 dark:text-black text-lg hover:cursor-pointer"
					@click="toggleShowPassword('password')"
				/>
				<p @click="forgotPassword" class="self-end hover:cursor-pointer">
					Mot de passe oublié?
				</p>
			</div>
			<div class="pb-10 text-center text-red-400" id="requestResult"></div>
			<div class="flex justify-end">
				<button class="btn btn-green">Se connecter</button>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { ICredentials } from "../../interfaces/ICredentials";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
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

const toggleShowPassword = (elem: string) => {
	const inputToToggle = document.getElementById(elem);
	if (inputToToggle && inputToToggle.getAttribute("type") === "password") {
		inputToToggle.setAttribute("type", "text");
		showPassword.value = true;
	} else {
		inputToToggle?.setAttribute("type", "password");
		showPassword.value = false;
	}
};

const emit = defineEmits<{
	(e: "login", credentials: ICredentials): void;
	(e: "forgotPassword"): void;
}>();

const login = async (credentials: ICredentials) => {
	emit("login", credentials);
};

const forgotPassword = () => {
	emit("forgotPassword");
};
</script>
