<template>
	<div class="siteContainer">
		<h1 class="text-center sm:text-2xl mb-10">Création d'un compte</h1>
		<p class="text-center mb-10">
			Déjà inscrit?
			<button class="btn btn-green" @click="alreadyRegistered">
				Se connecter
			</button>
		</p>
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
						confirmedPassword,
						username,
						firstname,
						lastname,
						phone_number,
					})
				"
			>
				<div class="form-item mt-0">
					<label for="email"
						><font-awesome-icon class="text-red-500 text-xs" icon="asterisk" />
						Email</label
					>
					<input
						class="form-item-input"
						type="email"
						required
						id="email"
						v-model="email"
						pattern="^\S+@\S+\.\S+$"
						title="ex: exemple@domain.com"
					/>
				</div>
				<div class="form-item relative">
					<label for="password"
						><font-awesome-icon class="text-red-500 text-xs" icon="asterisk" />
						Mot de passe</label
					>
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
						v-if="showPassword"
						@click="toggleShowPassword('password')"
						class="absolute bottom-6 right-5 dark:text-black text-lg hover:cursor-pointer"
						icon="eye-slash"
					/>
					<font-awesome-icon
						v-else
						@click="toggleShowPassword('password')"
						class="absolute bottom-6 right-5 dark:text-black text-lg hover:cursor-pointer"
						icon="eye"
					/>
				</div>
				<div class="form-item relative">
					<label for="confirmedPassword"
						><font-awesome-icon class="text-red-500 text-xs" icon="asterisk" />
						Confirmer le mot de passe
						<font-awesome-icon
							v-if="passwordIsConfirmed"
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
						v-if="showConfirmedPassword"
						@click="toggleShowPassword('confirmedPassword')"
						class="absolute bottom-6 right-5 dark:text-black text-lg hover:cursor-pointer"
						icon="eye-slash"
					/>
					<font-awesome-icon
						v-else
						@click="toggleShowPassword('confirmedPassword')"
						class="absolute bottom-6 right-5 dark:text-black text-lg hover:cursor-pointer"
						icon="eye"
					/>
				</div>
				<div class="form-item">
					<label for="username"
						><font-awesome-icon class="text-red-500 text-xs" icon="asterisk" />
						Pseudonyme
					</label>
					<input
						class="form-item-input"
						type="text"
						required
						id="username"
						v-model="username"
					/>
				</div>
				<div class="form-item">
					<label for="firstname"
						><font-awesome-icon class="text-red-500 text-xs" icon="asterisk" />
						Prénom</label
					>
					<input
						class="form-item-input"
						type="text"
						required
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
				<RequestResult
					:resultMessage="resultMessage"
					:success="requestSuccess"
				/>
				<div class="flex justify-end">
					<button class="btn btn-green">Créer le compte</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import type { IUser } from "@/interfaces/IUser";
import axios from "axios";
import RequestResult from "@/components/commons/RequestResult.vue";

const emit = defineEmits<{
	(e: "alreadyRegistered"): void;
}>();

const router = useRouter();
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const confirmedPassword = ref("");
const showConfirmedPassword = ref(false);
const passwordIsConfirmed = ref(false);
const username = ref("");
const firstname = ref("");
const lastname = ref("");
const phone_number = ref("");
const resultMessage = ref("");
const requestSuccess = ref(false);

watch(password, (newVal) => {
	if (newVal === confirmedPassword.value && confirmedPassword.value !== "") {
		passwordIsConfirmed.value = true;
	} else {
		passwordIsConfirmed.value = false;
	}
});

watch(confirmedPassword, (newVal) => {
	if (newVal === password.value && password.value !== "") {
		passwordIsConfirmed.value = true;
	} else {
		passwordIsConfirmed.value = false;
	}
});

watch(confirmedPassword, (newVal) => {
	if (newVal === password.value && password.value !== "") {
		passwordIsConfirmed.value = true;
	} else {
		passwordIsConfirmed.value = false;
	}
});

const toggleShowPassword = (elem: string) => {
	const inputToToggle = document.getElementById(elem);
	if (inputToToggle && inputToToggle.getAttribute("type") === "password") {
		inputToToggle.setAttribute("type", "text");
		if (elem === "password") {
			showPassword.value = true;
		}
		if (elem === "confirmedPassword") {
			showConfirmedPassword.value = true;
		}
	} else {
		inputToToggle?.setAttribute("type", "password");
		if (elem === "password") {
			showPassword.value = false;
		}
		if (elem === "confirmedPassword") {
			showConfirmedPassword.value = false;
		}
	}
};

const register = async (userData: IUser) => {
	if (!passwordIsConfirmed.value) {
		requestSuccess.value = false;
		resultMessage.value = "Le mot de passe n'a pas été confirmé correctement";
	} else {
		await axios
			.request({
				method: "post",
				url: `${import.meta.env.VITE_URL_BACK}/auth/register`,
				data: userData,
			})
			.then((res) => {
				requestSuccess.value = true;
				resultMessage.value = "Votre compte a bien été enregistré";
				localStorage.setItem("token", res.data);
				window.dispatchEvent(new Event("storage"));
				router.push("/");
			})
			.catch((err) => {
				requestSuccess.value = false;
				resultMessage.value = err.response.data.message;
			});
	}
};

const alreadyRegistered = () => {
	emit("alreadyRegistered");
};
</script>
