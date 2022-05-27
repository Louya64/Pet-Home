<template>
	<tr>
		<td>{{ offer.id }}</td>
		<td class="flex justify-center items-center">
			<div class="overflow-hidden">
				<Thumbnail :id_offer="offer.id" :alt="offer.category.name" />
			</div>
		</td>
		<td>
			{{ offer.creation_date.slice(0, 10).split("-").reverse().join("/") }}
		</td>
		<td>
			{{
				offer.adoption_date
					? offer.adoption_date.slice(0, 10).split("-").reverse().join("/")
					: ""
			}}
		</td>
		<td>
			{{ offer.status.name }}
		</td>
		<td>
			{{
				offer.animal_name
					? offer.animal_name.length > 10
						? offer.animal_name.slice(0, 10) + "..."
						: offer.animal_name
					: ""
			}}
		</td>
		<td>
			{{
				offer.age / 12 > 2
					? Math.round(offer.age / 12) + " ans"
					: offer.age + " mois"
			}}
		</td>
		<td>{{ offer.category.name }}</td>
		<td>
			{{
				offer.race
					? offer.race.name.length > 10
						? offer.race.name.slice(0, 10) + "..."
						: offer.race.name
					: ""
			}}
		</td>
		<td>{{ offer.zipcode }}</td>
		<td>
			{{ offer.city.length > 6 ? offer.city.slice(0, 6) + "..." : offer.city }}
		</td>
		<td>
			<font-awesome-icon
				v-if="offer.identified"
				class="text-2xl -mb-1"
				icon="check"
			/>
			<font-awesome-icon v-else class="text-2xl -mb-1" icon="xmark" />
		</td>
		<td>
			<font-awesome-icon
				v-if="offer.vaccinated"
				class="text-2xl -mb-1"
				icon="check"
			/>
			<font-awesome-icon v-else class="text-2xl -mb-1" icon="xmark" />
		</td>
		<td>
			<font-awesome-icon
				v-if="offer.disabled"
				class="text-2xl -mb-1"
				icon="check"
			/>
			<font-awesome-icon v-else class="text-2xl -mb-1" icon="xmark" />
		</td>
		<td>
			{{
				offer.disability
					? offer.disability.length > 10
						? offer.disability.slice(0, 10) + "..."
						: offer.disability
					: ""
			}}
		</td>
		<td>
			{{
				offer.description
					? offer.description.length > 15
						? offer.description.slice(0, 15) + "..."
						: offer.description
					: ""
			}}
		</td>

		<td>
			<button
				@click="() => router.push(`/dashboard/offers/${offer.id}`)"
				class="btn btn-green"
			>
				Voir / Modifier
			</button>
		</td>

		<td>
			<button @click="confirmDelete(offer.id)" class="btn btn-red">
				Supprimer
			</button>
		</td>
	</tr>
</template>

<script setup lang="ts">
import type { IOfferRes } from "@/interfaces/IOffer";
import Thumbnail from "./Thumbnail.vue";
import axios from "axios";
import { useRouter } from "vue-router";

interface Props {
	offer: IOfferRes;
}

defineProps<Props>();
const emit = defineEmits<{
	(e: "requestResult", success: boolean, message: string): void;
}>();

const router = useRouter();

const confirmDelete = (id: number) => {
	const confirmed = confirm(`Voulez-vous vraiment supprimer l'offre ${id} ?`);
	if (confirmed) {
		deleteOffer(id);
	}
};

const deleteOffer = (id: number) => {
	axios
		.delete(`${import.meta.env.VITE_URL_BACK}/offers/${id}`)
		.then(() => {
			emit("requestResult", true, `L'annonce ${id} a bien été supprimée`);
		})
		.catch((err) => {
			emit("requestResult", false, err.response.data.message);
		});
};
</script>
