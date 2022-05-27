<template>
	<form @submit.prevent="sendMessage" class="flex p-10">
		<input
			type="text"
			v-model="message"
			class="flex-1 border-2 border-slate-500"
		/>
		<button class="btn btn-green">Envoyer</button>
	</form>
</template>

<script setup lang="ts">
import { io } from "socket.io-client";
import { ref } from "vue";

interface Props {
	origin: string;
}

const props = defineProps<Props>();

// en props l'id adoptreq + statut auteur + idautor ?

const socket = io(`${import.meta.env.VITE_URL_BACK}`);
const message = ref("");

socket.on("confirmConnection", (message: any) => {
	console.log(message);
});
socket.on("message du back", (message: any) => {
	console.log(message);
});

const sendMessage = () => {
	socket.emit(`message ${props.origin}`, message.value);
};
</script>
