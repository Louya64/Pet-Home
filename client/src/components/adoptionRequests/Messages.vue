<template>
	<h2 class="text-xl text-center">
		Historique des messages de la candidature {{ props.idReq }}
	</h2>
	<div v-if="messagesList">
		<div
			v-for="message in messagesList.slice().reverse()"
			:class="[
				message.author.id_role === 1 || message.author.id_role === 2
					? 'text-right'
					: 'text-left',
			]"
			class="mt-20"
		>
			<p class="text-xl text-orange-800">
				{{ message.author.username || "anonyme" }}
			</p>
			<p>{{ message.text }}</p>
			<p>date: {{ message.creation_date }}</p>
			<p>role: {{ message.author.role.name }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, onMounted, type Ref, watch } from "vue";
import type { IMessageRes } from "@/interfaces/IMessage";

interface Props {
	idReq: number;
}

const props = defineProps<Props>();
const messagesList: Ref<IMessageRes[]> = ref([]);

const getMessagesList = () => {
	axios
		.get(`${import.meta.env.VITE_URL_BACK}/messages?idReq=${props.idReq}`)
		.then((res) => {
			messagesList.value = res.data;
		});
};

onMounted(() => {
	getMessagesList();
});

watch(props, () => {
	getMessagesList();
});
</script>
