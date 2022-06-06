<template>
	<h1>Historique des messages de la candidature {{ props.idReq }}</h1>
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
let offset = 0;

const getMessagesList = (firstReq: boolean) => {
	if (firstReq) {
		offset = 0;
	}
	const limit = `&limit=5&offset=${offset}`;

	axios
		.get(
			`${import.meta.env.VITE_URL_BACK}/messages?idReq=${props.idReq}${limit}`
		)
		.then((res) => {
			if (firstReq) {
				messagesList.value = res.data;
				setTimeout(() => {
					window.scrollTo(0, document.body.scrollHeight);
				});
			} else {
				messagesList.value = [...messagesList.value, ...res.data];
			}
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
		getMessagesList(true);
	}
});

const handleScroll = () => {
	if (document.documentElement.scrollTop === 0) {
		const documentHeight = document.body.clientHeight;
		window.removeEventListener("scroll", handleScroll);
		offset += 5;
		getMessagesList(false);
		setTimeout(() => {
			window.addEventListener("scroll", handleScroll);
			window.scrollTo(0, document.body.scrollHeight - documentHeight);
		}, 500);
	}
};

onMounted(() => {
	getMessagesList(true);
	window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll);
});
</script>
