<template>
	<h1 class="text-center sm:text-2xl mb-10">Changez votre mot de passe</h1>
	<div class="px-20">
		<form
			class="form lg:w-1/2 mx-auto"
			@submit.prevent="changePassword(password, confirmedPassword)"
		>
			<div class="form-item relative">
				<label for="password">Nouveau mot de passe</label>
				<input
					class="form-item-input"
					type="password"
					required
					id="password"
					v-model="password"
					pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@#$%^&(){}[:;<>,.?/~_+-=|])[0-9a-zA-Z*.!@#$%^&(){}[:;<>,.?/~_+-=|]{8,}$"
					title="au moins 8 caractères dont 1 nombre, 1 minuscule, 1 majuscule, et 1 caractère spécial"
				/>
				<font-awesome-icon
					@click="toggleShowPassword('password')"
					class="absolute bottom-6 right-5 dark:text-black text-lg hover:cursor-pointer"
					icon="eye-slash"
				/>
			</div>
			<div class="form-item relative">
				<label for="confirmedPassword">
					Confirmer le mot de passe
					<font-awesome-icon
						v-if="passwordConfirmed"
						class="text-green-500 text-2xl -mb-1"
						icon="check" />
					<font-awesome-icon
						v-else
						v-if="password !== ''"
						class="text-red-500 text-2xl -mb-1"
						icon="xmark"
				/></label>
				<input
					class="form-item-input"
					type="password"
					required
					id="confirmedPassword"
					v-model="confirmedPassword"
				/>
				<font-awesome-icon
					@click="toggleShowPassword('confirmedPassword')"
					class="absolute bottom-6 right-5 dark:text-black text-lg hover:cursor-pointer"
					icon="eye-slash"
				/>
			</div>
			<div class="pb-10 text-center" id="requestResult"></div>
			<div class="flex justify-end">
				<button class="btn btn-green">Valider</button>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const emit = defineEmits<{
	(e: "changePassword", password: string, confirmedPassword: string): void;
}>();

const password = ref("");
const confirmedPassword = ref("");
const passwordConfirmed = ref(false);
let requestResult = document.getElementById("requestResult");

onMounted(() => {
	requestResult = document.getElementById("requestResult");
});

watch(password, () => {
	if (requestResult) {
		requestResult.textContent = "";
	}
});

watch(confirmedPassword, (newVal) => {
	if (requestResult) {
		requestResult.textContent = "";
	}
	if (newVal === password.value && password.value !== "") {
		passwordConfirmed.value = true;
	} else {
		passwordConfirmed.value = false;
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

const changePassword = (password: string, confirmedPassword: string) => {
	emit("changePassword", password, confirmedPassword);
};
</script>
