<template>
	<form @submit.prevent="submit" class="form w-1/2 absolute -top-32 right-20">
		<div class="flex justify-between">
			<div class="form-item">
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
			<div class="form-item">
				<label for="phone_number">Numéro de téléphone</label>
				<input
					class="form-item-input"
					type="text"
					id="phone_number"
					v-model="phone_number"
				/>
			</div>
		</div>
		<div class="form-item">
			<label for="message"
				><font-awesome-icon class="text-red-500 text-xs" icon="asterisk" />
				Présentez-vous (minimum 100 caractères)</label
			>
			<textarea
				required
				id="message"
				cols="30"
				rows="10"
				minlength="100"
				v-model="message"
			></textarea>
		</div>
		<RequestResult :resultMessage="resultMessage" :success="requestSuccess" />
		<div class="flex justify-end">
			<button type="submit" class="btn btn-green">Envoyer</button>
		</div>
	</form>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import RequestResult from "@/components/commons/RequestResult.vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const email = ref("");
const phone_number = ref("");
const message = ref("");
const resultMessage = ref("");
const requestSuccess = ref(false);

onMounted(() => {
	if (localStorage.getItem("userId")) {
		axios
			.get(
				`${import.meta.env.VITE_URL_BACK}/users/${localStorage.getItem(
					"userId"
				)}`
			)
			.then((res) => {
				email.value = res.data.email;
				phone_number.value = res.data.phone_number;
			});
	}
});

const submit = () => {
	const adoptionRequest = {
		id_offer: Number(route.params.idOffer),
		candidate_email: email.value,
		candidate_phone: phone_number.value || null,
		id_candidate: Number(localStorage.getItem("userId")) || null,
		id_adoption_status: 5,
		message: message.value,
	};
	axios
		.post(`${import.meta.env.VITE_URL_BACK}/adoptionRequests`, adoptionRequest)
		.then(() => {
			requestSuccess.value = true;
			resultMessage.value =
				"Votre demande a été envoyée, nous vous recontactons bientôt.";
		})
		.catch((err) => {
			requestSuccess.value = false;
			resultMessage.value = err.response.data.message;
		});
};
</script>
