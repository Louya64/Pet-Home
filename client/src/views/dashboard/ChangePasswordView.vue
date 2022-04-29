<template>
<<<<<<< HEAD
	<h1 class="text-center sm:text-2xl my-20">Changez votre mot de passe</h1>
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
=======
	<div class="pt-[15vh] min-h-screen">
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
>>>>>>> 8828e18 (move dashboard into client folder)
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import jwt_decode from "jwt-decode";

interface ITokenDecoded {
	id: number;
	role: number;
	iat: number;
}

const route = useRoute();
const router = useRouter();
const password = ref("");
const confirmedPassword = ref("");
const passwordConfirmed = ref(false);
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
	axios
		.request({
			method: "put",
			url: `${import.meta.env.VITE_URL_BACK}/users/${userId}`,
			data: { password: password, confirmedPassword: confirmedPassword },
		})
		.then(() => {
			if (requestResult) {
				requestResult?.classList.remove("text-red-400");
				requestResult?.classList.add("text-green-400");
				requestResult.textContent = "Redirection vers la page de connection...";
			}
			setTimeout(() => {
				router.push("/dashboard/login");
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
