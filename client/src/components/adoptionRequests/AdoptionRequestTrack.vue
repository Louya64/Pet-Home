<template>
	<div class="dashboardContainer relative px-20" v-if="adoptionRequest">
		<h1>Suivi de la candidature {{ adoptionRequest.id }}</h1>
		<div class="flex justify-around mt-20">
			<div>
				<OfferCard v-if="offer" :offer="offer" class="w-[20vw]" />
			</div>
			<div class="w-[30vw]">
				mail : {{ adoptionRequest.candidate_email }} <br />
				tel : {{ adoptionRequest.candidate_phone }} <br />
				infos candidat dropdown (userCard si inscrit ? ou link ?)
			</div>
		</div>
		<div class="mt-20 text-center" v-if="adoptionStatusList">
			<RequestResult :resultMessage="resultMessage" :success="requestSuccess" />
			<form @submit.prevent="updateAdoptionStatus">
				<label>Modifier le statut :</label>
				<select v-model="statusId">
					<option
						v-for="adoptionStatus in adoptionStatusList"
						:value="adoptionStatus.id"
					>
						{{ adoptionStatus.name }}
					</option>
				</select>
				<button class="btn btn-green">Valider</button>
			</form>
		</div>
		<div class="mt-20 text-center">
			<Messages
				:idReq="adoptionRequest.id"
				:newMessage="newMessage"
				:addMessageFromSocket="addMessageFromSocket"
				@messageAdded="() => (addMessageFromSocket = false)"
			/>
		</div>
		<div id="socketContainer" class="absolute bottom-0 left-0 right-0">
			<Socket
				origin="de l'admin"
				:idReq="adoptionRequest.id.toString()"
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
import { ref, onMounted, type Ref } from "vue";
import { useRoute } from "vue-router";
import type { IAdoptionRequestRes } from "@/interfaces/IAdoptionRequest";
import type { IOfferRes } from "@/interfaces/IOffer";
import type { IAdoptionStatusRes } from "@/interfaces/IAdoptionStatus";
import type { IMessageRes, IMessageSocketRes } from "@/interfaces/IMessage";
import OfferCard from "@/components/offers/OfferCard.vue";
import Messages from "@/components/adoptionRequests/Messages.vue";
import RequestResult from "../commons/RequestResult.vue";
import Socket from "./Socket.vue";

const adoptionRequest: Ref<IAdoptionRequestRes | undefined> = ref();
const adoptionStatusList: Ref<IAdoptionStatusRes[]> = ref([]);
const route = useRoute();
const offer: Ref<IOfferRes | undefined> = ref();
const statusId = ref();
const newMessage: Ref<IMessageSocketRes | null> = ref(null);
const addMessageFromSocket = ref(false);
const resultMessage = ref("");
const requestSuccess = ref(false);

const getAdoptionStatusList = () => {
	axios.get(`${import.meta.env.VITE_URL_BACK}/adoptionStatus`).then((res) => {
		adoptionStatusList.value = res.data;
	});
};

const updateAdoptionStatus = () => {
	let needConfirm = false;
	if (statusId.value === 2) {
		needConfirm = true;
		const confirmed = confirm(
			"Confirmez-vous avoir envoyé un message expliquant le motif du refus ?"
		);
		if (!confirmed) {
			return;
		} else {
			needConfirm = false;
		}
	}
	if (!needConfirm) {
		axios
			.put(
				`${import.meta.env.VITE_URL_BACK}/adoptionRequests/${route.params.id}`,
				{ id_adoption_status: statusId.value }
			)
			.then(() => {
				requestSuccess.value = true;
				resultMessage.value = "Statut mis à jour";
			})
			.catch((err) => {
				requestSuccess.value = false;
				resultMessage.value = err.response.data.message;
			});
	}
};

const resetUnredMessages = () => {
	axios
		.get(
			`${import.meta.env.VITE_URL_BACK}/messages?idReq=${
				route.params.id
			}&seen=false&authorRole=3`
		)
		.then((res) => {
			if (res.data.length) {
				res.data.map((message: IMessageRes) => {
					updateMessage(message.id);
				});
			}
		});
};

const updateMessage = async (id: number) => {
	await axios.put(`${import.meta.env.VITE_URL_BACK}/messages/${id}`, {
		seen: true,
	});
};

onMounted(async () => {
	axios
		.get(`${import.meta.env.VITE_URL_BACK}/adoptionRequests/${route.params.id}`)
		.then(async (res) => {
			offer.value = await axios
				.get(`${import.meta.env.VITE_URL_BACK}/offers/${res.data.id_offer}`)
				.then((res) => {
					return res.data;
				});
			adoptionRequest.value = res.data;
			statusId.value = res.data.id_adoption_status;
		});
	getAdoptionStatusList();
	resetUnredMessages();
});
</script>
