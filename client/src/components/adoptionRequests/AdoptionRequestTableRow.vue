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
			<div class="flex justify-center">
				<button
					@click="
						() =>
							router.push(`/dashboard/adoptionRequests/${adoptionRequest.id}`)
					"
					class="btn btn-green"
				>
					Ouvrir
				</button>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts">
import type { IAdoptionRequestRes } from "@/interfaces/IAdoptionRequest";
import { useRouter } from "vue-router";

interface Props {
	adoptionRequest: IAdoptionRequestRes;
}

defineProps<Props>();

const router = useRouter();
</script>
