<template>
	<h1 class="text-center sm:text-2xl mb-10">
		Vous avez oublié votre mot de passe
	</h1>
	<p class="text-center">
		Un email va vous être envoyé pour pouvoir changer de mot de passe
	</p>
	<div class="px-20">
		<form class="form lg:w-1/2 mx-auto" @submit.prevent="forgotPassword(email)">
			<div class="form-item">
				<label for="email">Email</label>
				<input class="form-item-input" type="text" id="email" v-model="email" />
			</div>
			<RequestResult :resultMessage="resultMessage" :success="requestSuccess" />
			<div class="flex justify-end">
				<button class="btn btn-green">Valider</button>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import RequestResult from "../../components/commons/RequestResult.vue";

interface Props {
	resultMessage: string;
	requestSuccess: boolean;
}

defineProps<Props>();
const emit = defineEmits<{
	(e: "sendLink", email: string): void;
}>();

const email = ref("");

const forgotPassword = (email: string) => {
	emit("sendLink", email);
};
</script>
