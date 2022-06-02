<template>
	<div class="siteContainer min-h-[100vh] relative">
		<h1>Mes demandes d'adoption</h1>
		<div class="w-[300px] h-[90vh] fixed top-[10vh] pl-5">
			<ul v-if="myOffersList.length" class="overflow-y-auto h-[90vh] pr-5">
				<li
					v-for="adoptionRequest in myAdoptionRequestsList"
					class="flex items-center"
				>
					<OfferCard
						class="w-[100%]"
						:offer="
							myOffersList.filter(
								(offer) => offer.id === adoptionRequest.id_offer
							)[0]
						"
					/>
					<div
						@click="() => (currentIdReq = adoptionRequest.id)"
						class="hover:cursor-pointer flex flex-col justify-center items-center"
					>
						<div class="relative">
							<font-awesome-icon class="text-xl" icon="message" />
							<font-awesome-icon
								v-if="idReqArrayUnred.includes(adoptionRequest.id)"
								class="text-xs text-red-500 absolute -top-1 -right-1"
								icon="circle"
							/>
						</div>

						<button>Messagerie</button>
					</div>
				</li>
			</ul>
		</div>
		<div v-if="currentIdReq" class="ml-[300px] p-20 pb-40">
			<Messages
				:idReq="currentIdReq"
				:newMessage="newMessage"
				:addMessageFromSocket="addMessageFromSocket"
				@messageAdded="() => (addMessageFromSocket = false)"
			/>
		</div>
		<div class="ml-[300px] absolute bottom-0 right-0 left-0">
			<Socket
				origin="du site"
				:idReq="currentIdReq.toString()"
				@newMessageReceived="
					(message) => {
						(newMessage = message), (addMessageFromSocket = true);
					}
				"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, type Ref, onMounted, watch, onBeforeMount } from "vue";
import type { IAdoptionRequestRes } from "@/interfaces/IAdoptionRequest";
import type { IOfferRes } from "@/interfaces/IOffer";
import type { IMessageSocketRes, IMessageRes } from "@/interfaces/IMessage";
import OfferCard from "@/components/offers/OfferCard.vue";
import Messages from "@/components/adoptionRequests/Messages.vue";
import Socket from "@/components/adoptionRequests/Socket.vue";

const myAdoptionRequestsList: Ref<IAdoptionRequestRes[]> = ref([]);
const myOffersList: Ref<IOfferRes[]> = ref([]);
const currentIdReq = ref(0);
const newMessage: Ref<IMessageSocketRes | null> = ref(null);
const addMessageFromSocket = ref(false);
const idReqArrayUnred: Ref<number[]> = ref([]);
const unredMessagesList: Ref<IMessageRes[]> = ref([]);

const getMyAdoptionRequestsList = () => {
	axios
		.get(
			`${
				import.meta.env.VITE_URL_BACK
			}/adoptionRequests?userId=${localStorage.getItem("userId")}`
		)
		.then(async (res) => {
			const idOffersArray = res.data.map(
				(adoptionReq: IAdoptionRequestRes) => adoptionReq.id_offer
			);

			await axios
				.get(`${import.meta.env.VITE_URL_BACK}/offers?idIn=${idOffersArray}`)
				.then((res) => {
					myOffersList.value = res.data;
				});

			myAdoptionRequestsList.value = res.data;
			currentIdReq.value = res.data[0].id;
		});
};

const getUnredMessages = async () => {
	unredMessagesList.value = [];
	idReqArrayUnred.value = [];
	const idReqArray = myAdoptionRequestsList.value.map(
		(adoptionReq: IAdoptionRequestRes) => adoptionReq.id
	);
	await axios
		.get(
			`${
				import.meta.env.VITE_URL_BACK
			}/messages?idReqIn=${idReqArray}&seen=false&authorRole=!3`
		)
		.then((res) => {
			if (!res.data.length) {
				localStorage.removeItem("newMessage");
				window.dispatchEvent(new Event("storage"));
			}
			unredMessagesList.value = res.data;
			idReqArrayUnred.value = idReqArray.filter((id: number) =>
				res.data.find(
					(message: IMessageRes) => message.id_adoption_request === id
				)
			);
		});
};

const updateMessage = async (id: number) => {
	await axios.put(`${import.meta.env.VITE_URL_BACK}/messages/${id}`, {
		seen: true,
	});
};

const resetUnredMessagesFromCurrentIdReq = (idReq: number) => {
	unredMessagesList.value
		.filter((message) => {
			return message.id_adoption_request === idReq;
		})
		.map((message) => {
			updateMessage(message.id);
		});
	setTimeout(() => {
		getUnredMessages();
	}, 500);
};

watch(currentIdReq, async () => {
	await getUnredMessages();
	resetUnredMessagesFromCurrentIdReq(currentIdReq.value);
});

onMounted(() => {
	getMyAdoptionRequestsList();
});
</script>
