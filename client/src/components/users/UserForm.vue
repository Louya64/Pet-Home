<template>
	<form
		class="form relative"
		@submit.prevent="
			submit({
				id_role,
				username,
				lastname,
				firstname,
				password,
				confirmedPassword,
				lastPassword,
				email,
				phone_number,
			})
		"
	>
		<div v-if="props.user && !readOnly" class="absolute right-28 -top-0">
			<button @click.prevent="confirmDelete" class="btn btn-red">
				Supprimer mon profil
			</button>
		</div>
		<div class="flex">
			<div class="w-1/2 p-10">
				<div class="form-item">
					<label for="username"
						><font-awesome-icon
							v-if="!readOnly"
							class="text-red-500 text-xs"
							icon="asterisk"
						/>
						Pseudonyme
						{{
							id_role === 2 ? "(prénom + un espace + 1ère lettre du nom)" : ""
						}}</label
					>
					<input
						:disabled="readOnly"
						required
						class="form-item-input"
						type="text"
						id="username"
						v-model="username"
					/>
				</div>
				<div class="form-item">
					<label for="email"
						><font-awesome-icon
							v-if="!readOnly"
							class="text-red-500 text-xs"
							icon="asterisk"
						/>
						Email</label
					>
					<input
						:disabled="readOnly"
						required
						class="form-item-input"
						type="email"
						id="email"
						v-model="email"
					/>
				</div>

				<div v-if="!readOnly">
					<div class="form-item relative" v-if="props.user">
						<label class="flex items-center" for="lastPassword">
							Ancien mot de passe
						</label>
						<input
							class="form-item-input"
							type="password"
							id="lastPassword"
							v-model="lastPassword"
						/>
						<font-awesome-icon
							v-if="showLastPassword"
							@click="toggleShowPassword('lastPassword')"
							class="absolute bottom-6 right-5 dark:text-black text-lg hover:cursor-pointer"
							icon="eye-slash"
						/>
						<font-awesome-icon
							v-else
							@click="toggleShowPassword('lastPassword')"
							class="absolute bottom-6 right-5 dark:text-black text-lg hover:cursor-pointer"
							icon="eye"
						/>
					</div>
					<div class="form-item relative">
						<label class="flex items-center" for="password"
							><font-awesome-icon
								v-if="!props.user"
								class="text-red-500 text-xs"
								icon="asterisk"
							/>
							<div class="flex items-center flex-1 ml-2 justify-between">
								Mot de passe
								<button @click.prevent="generatePassword" class="btn btn-green">
									Générer un mot de passe
								</button>
							</div>
						</label>
						<input
							class="form-item-input"
							type="password"
							:required="!props.user"
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
						<label for="confirmedPassword">
							<font-awesome-icon
								v-if="password !== ''"
								class="text-red-500 text-xs"
								icon="asterisk" />
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
							:required="password !== ''"
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
				</div>
			</div>

			<div class="w-1/2 p-10">
				<div class="form-item">
					<label for="lastname"
						><font-awesome-icon
							v-if="id_role === 2"
							class="text-red-500 text-xs"
							icon="asterisk"
						/>
						Nom de famille</label
					>
					<input
						:disabled="readOnly"
						:required="id_role === 2"
						class="form-item-input"
						type="text"
						id="lastname"
						v-model="lastname"
					/>
				</div>
				<div class="form-item">
					<label for="firstname"
						><font-awesome-icon
							v-if="!readOnly"
							class="text-red-500 text-xs"
							icon="asterisk"
						/>
						Prénom</label
					>
					<input
						:disabled="readOnly"
						required
						class="form-item-input"
						type="text"
						id="firstname"
						v-model="firstname"
					/>
				</div>
				<div class="form-item">
					<label for="phone">N° de téléphone</label>
					<input
						:disabled="readOnly"
						class="form-item-input"
						type="text"
						id="phone"
						v-model="phone_number"
					/>
				</div>
			</div>
		</div>
		<RequestResult :resultMessage="resultMessage" :success="requestSuccess" />
		<div class="flex justify-end" v-if="!readOnly">
			<button class="btn btn-green">Enregistrer</button>
		</div>
	</form>
</template>

<script setup lang="ts">
import { computed, ref, watch, type Ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import RequestResult from "@/components/commons/RequestResult.vue";
import type { IUserRes, IUserCreateOrUpdate } from "@/interfaces/IUser";

interface Props {
	user: IUserRes | null;
}

const props = defineProps<Props>();
const router = useRouter();
const watcherId: Ref<string | null> = ref(
	localStorage.getItem("userId") ? localStorage.getItem("userId") : null
);
const readOnly = computed(() => {
	if (props.user) {
		return Number(watcherId.value) !== props.user.id;
	} else {
		return false;
	}
});
const id_role = ref(2);
const username = ref("");
const lastname = ref("");
const firstname = ref("");
const email = ref("");
const password = ref("");
const phone_number = ref("");
const resultMessage = ref("");
const requestSuccess = ref(false);
const showPassword = ref(false);
const confirmedPassword = ref("");
const lastPassword = ref("");
const showConfirmedPassword = ref(false);
const showLastPassword = ref(false);
const passwordIsConfirmed = ref(false);
const isSuperAdmin = ref(false);
if (localStorage.getItem("userRole") === "1") {
	isSuperAdmin.value = true;
}

if (props.user) {
	id_role.value = props.user.id_role;
	if (props.user.username) username.value = props.user.username;
	if (props.user.lastname) lastname.value = props.user.lastname;
	if (props.user.firstname) firstname.value = props.user.firstname;
	email.value = props.user.email;
	if (props.user.phone_number) phone_number.value = props.user.phone_number;
}

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
		if (elem === "lastPassword") {
			showLastPassword.value = true;
		}
	} else {
		inputToToggle?.setAttribute("type", "password");
		if (elem === "password") {
			showPassword.value = false;
		}
		if (elem === "confirmedPassword") {
			showConfirmedPassword.value = false;
		}
		if (elem === "lastPassword") {
			showLastPassword.value = false;
		}
	}
};

const generatePassword = () => {
	let pass = "Pa1+";
	const str =
		"ABCDEFGHIJKLMNPQRSTUVWXYZ" +
		"abcdefghijklmnpqrstuvwxyz123456789*.!@#$%^&(){}[:;<>,.?/~_+-=|]";
	for (let i = 1; i <= 15; i++) {
		const char = Math.floor(Math.random() * str.length + 1);

		pass += str.charAt(char);
	}
	password.value = pass;
};

const confirmDelete = () => {
	const confirmed = confirm(`Voulez-vous vraiment supprimer votre profil ?`);
	if (confirmed) {
		props.user && deleteUser(props.user.id);
	}
};

const deleteUser = (id: number) => {
	axios
		.delete(`${import.meta.env.VITE_URL_BACK}/users/${id}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
		.then(() => {
			requestSuccess.value = true;
			resultMessage.value = `Votre profil a bien été supprimé, vous allez être redirigé vers la page de connection`;
			setTimeout(() => {
				router.push("/auth");
			}, 3000);
		})
		.catch((err) => {
			requestSuccess.value = false;
			resultMessage.value = err.response.data.message;
		});
};

const submit = async (data: IUserCreateOrUpdate) => {
	if (data.id_role === 2) {
		const usernameShouldBe = data.firstname + " " + data.lastname?.slice(0, 1);

		if (data.username !== usernameShouldBe) {
			if (!confirm("Êtes-vous sûr de vouloir garder ce pseudonyme?")) return;
		}
	}

	let userToUpdate = data;

	if (props.user && data.password === "") {
		userToUpdate = {
			id_role: data.id_role,
			username: data.username,
			lastname: data.lastname,
			firstname: data.firstname,
			email: data.email,
			phone_number: data.phone_number,
		};
	}

	if (props.user) {
		await axios
			.put(
				`${import.meta.env.VITE_URL_BACK}/users/${props.user.id}`,
				userToUpdate,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			)
			.then(() => {
				requestSuccess.value = true;
				resultMessage.value = "L'utilisateur a bien été modifié";
			})
			.catch((err) => {
				requestSuccess.value = false;
				resultMessage.value = err.response.data.message;
			});
	} else {
		const userToCreate = data;
		delete userToCreate.lastPassword;

		await axios
			.post(
				`${import.meta.env.VITE_URL_BACK}/dashboard/auth/register`,
				userToCreate,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			)
			.then(() => {
				requestSuccess.value = true;
				resultMessage.value = "L'utilisateur a bien été enregistré";
			})
			.catch((err) => {
				requestSuccess.value = false;
				resultMessage.value = err.response.data.message;
			});
	}
};
</script>
