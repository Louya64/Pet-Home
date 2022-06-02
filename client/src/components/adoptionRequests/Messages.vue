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
				{{
					message.author.id_role === 1 || message.author.id_role === 2
						? "(admin)"
						: ""
				}}
			</p>
			<p>
				date:
				{{
					message.creation_date.slice(0, 10).split("-").reverse().join("/") +
					" " +
					message.creation_date.slice(11, 16)
				}}
			</p>
			<br />
			<p>{{ message.text }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import axios from "axios";
import {
	ref,
	onMounted,
	type Ref,
	watch,
	onUnmounted,
	onBeforeUnmount,
} from "vue";
import type { IMessageRes, IMessageSocketRes } from "@/interfaces/IMessage";

interface Props {
	idReq: number;
	newMessage: IMessageSocketRes | null;
	addMessageFromSocket: boolean;
}

const emit = defineEmits<{
	(e: "messageAdded"): void;
	(e: "displayNewMessageIcon", display: boolean, idReq: number): void;
}>();

const props = defineProps<Props>();
const messagesList: Ref<(IMessageRes | IMessageSocketRes)[]> = ref([]);

const getMessagesList = () => {
	axios
		.get(`${import.meta.env.VITE_URL_BACK}/messages?idReq=${props.idReq}`)
		.then((res) => {
			messagesList.value = res.data;
			setTimeout(() => {
				window.scrollTo(0, document.body.scrollHeight);
			});
		});
};

watch(props, () => {
	if (props.addMessageFromSocket && props.newMessage) {
		if (
			props.newMessage.author.id_role === 1 ||
			props.newMessage.author.id_role === 2
		) {
			emit("displayNewMessageIcon", true, props.idReq);
		}
		messagesList.value = [props.newMessage, ...messagesList.value];
		setTimeout(() => {
			emit("messageAdded");
			window.scrollTo(0, document.body.scrollHeight);
		}, 300);
	} else {
		getMessagesList();
	}
});

onMounted(() => {
	getMessagesList();
});
</script>
