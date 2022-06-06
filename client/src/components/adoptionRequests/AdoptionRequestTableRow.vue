<template>
	<tr>
		<td>{{ adoptionRequest.id }}</td>
		<td>
			{{
				adoptionRequest.creation_date
					.slice(0, 10)
					.split("-")
					.reverse()
					.join("/")
			}}
		</td>
		<td
			:class="[
				adoptionRequest.status.name === 'Refusé'
					? 'text-red-500'
					: adoptionRequest.status.name === 'Accepté'
					? 'text-green-600'
					: adoptionRequest.status.name === 'Nouveau'
					? 'text-blue-500'
					: '',
			]"
		>
			{{ adoptionRequest.status.name }}
		</td>
		<td>{{ adoptionRequest.id_offer }}</td>
		<td>{{ adoptionRequest.candidate_email }}</td>
		<td>{{ adoptionRequest.candidate_phone }}</td>
		<td>{{ adoptionRequest.id_candidate }}</td>
		<td>
			<div class="flex justify-center relative">
				<button
					@click="
						() =>
							router.push(`/dashboard/adoptionRequests/${adoptionRequest.id}`)
					"
					class="btn btn-green"
				>
					Ouvrir
				</button>
				<font-awesome-icon
					v-if="newMessage"
					class="text-xs text-red-500 absolute top-0 right-0"
					icon="circle"
				/>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts">
import type { IAdoptionRequestRes } from "@/interfaces/IAdoptionRequest";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

interface Props {
	adoptionRequest: IAdoptionRequestRes;
}

const props = defineProps<Props>();

const router = useRouter();
const newMessage = ref(false);

const getUnredMessages = () => {
	axios
		.get(
			`${import.meta.env.VITE_URL_BACK}/messages?idReq=${
				props.adoptionRequest.id
			}&seen=false&authorRole=3`
		)
		.then((res) => {
			if (res.data.length) {
				newMessage.value = true;
			}
		});
};

onMounted(() => {
	getUnredMessages();
});
</script>
