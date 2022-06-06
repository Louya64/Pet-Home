<template>
	<div class="dashboardContainer relative px-20" v-if="adoptionRequest">
		<div class="fixed top-0 left-60 right-0 z-10">
			<div
				class="flex justify-end hover:cursor-pointer"
				title="Détails de la candidature, modification du statut"
				@click="() => (showMenu = true)"
				v-if="!showMenu"
			>
				<div class="py-3 px-5 bg-black border-2 border-white">
					<font-awesome-icon class="text-2xl" icon="bars" />
				</div>
			</div>

			<div v-if="showMenu" class="bg-slate-700">
				<div
					class="flex justify-end hover:cursor-pointer"
					@click="() => (showMenu = false)"
				>
					<div class="py-3 px-5 bg-black border-2 border-white">
						<font-awesome-icon class="text-2xl" icon="xmark" />
					</div>
				</div>
				<div class="flex justify-around mt-20 px-20 w-full">
					<div>
						<OfferCard v-if="offer" :offer="offer" class="w-[20vw]" />
					</div>
					<div class="w-1/2 border-black border-2 p-5">
						mail : {{ adoptionRequest.candidate_email }} <br />
						tel : {{ adoptionRequest.candidate_phone }} <br />
						<span class="underline hover:cursor-pointer">Voir le profil</span>
						id : {{ adoptionRequest.id_candidate }} <br />
						infos candidat dropdown (userCard si inscrit ? ou link ?)
					</div>
				</div>
				<div class="text-center pb-20" v-if="adoptionStatusList">
					<RequestResult
						:resultMessage="resultMessage"
						:success="requestSuccess"
					/>
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
			</div>
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
const showMenu = ref(false);

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
