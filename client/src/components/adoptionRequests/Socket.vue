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
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import axios from "axios";
import type { IMessageSocketRes } from "@/interfaces/IMessage";

interface Props {
	origin: string;
	idReq: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	(e: "newMessageReceived", message: IMessageSocketRes): void;
}>();

const socket = io(`${import.meta.env.VITE_URL_BACK}`);
const message = ref("");
const idAuthor = localStorage.getItem("userId");
const roleAuthor = localStorage.getItem("userRole");

watch(props, () => {
	socket.emit(`joinRoom`, props.idReq);
});

socket.on("updateMessages", (message: IMessageSocketRes) => {
	emit("newMessageReceived", message);
});

onBeforeUnmount(() => {
	socket.emit(`leave`);
});

const sendMessage = () => {
	if (message.value) {
		const messageToSocket = {
			author: {
				id_role: Number(localStorage.getItem("userRole")),
				username: localStorage.getItem("userUsername"),
			},
			text: message.value,
		};

		axios
			.post(`${import.meta.env.VITE_URL_BACK}/messages`, {
				id_adoption_request: props.idReq,
				id_author: Number(idAuthor),
				text: message.value,
			})
			.then(() => {
				message.value = "";
			});

		socket.emit(`newMessage`, messageToSocket, props.idReq);
	}
};

onMounted(() => {
	socket.emit(`joinRoom`, props.idReq);
});
</script>
