<template>
	<main class="dashboardContainer">
		<h1>Liste des annonces</h1>
		<table
			v-if="offersList"
			class="w-full border-collapse border table-auto border-slate-500 text-center"
		>
			<thead>
				<tr>
					<td>Id <font-awesome-icon class="text-xs" icon="chevron-down" /></td>
					<td>Photo</td>
					<td class="relative" title="date de création">
						Créat
						<font-awesome-icon
							class="text-xs absolute right-2 top-2"
							icon="chevron-up"
						/>
					</td>
					<td title="date d'adoption">Adopt</td>
					<td>statut</td>
					<td title="nom de l'animal">Nom</td>
					<td>age</td>
					<td title="catégorie">Cat</td>
					<td>race</td>
					<td title="code postal">CP</td>
					<td>ville</td>
					<td title="identifié ?">Id ?</td>
					<td title="vacciné ?">Vac ?</td>
					<td title="handicapé ?">Hand ?</td>
					<td title="type de handicap">Handicap</td>
					<td>description</td>
					<td></td>
					<td></td>
				</tr>
			</thead>
			<tbody>
				<tr v-for="offer in offersList" class="hover:cursor-pointer">
					<td>{{ offer.id }}</td>
					<td class="flex justify-center items-center">
						<div class="overflow-hidden">
							<Thumbnail :id_offer="offer.id" :alt="offer.category.name" />
						</div>
					</td>
					<td>
						{{
							offer.creation_date.slice(0, 10).split("-").reverse().join("/")
						}}
					</td>
					<td>
						{{
							offer.adoption_date
								? offer.adoption_date
										.slice(0, 10)
										.split("-")
										.reverse()
										.join("/")
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
					<td>{{ offer.race ? offer.race.name : "" }}</td>
					<td>{{ offer.zipcode }}</td>
					<td>
						{{
							offer.city.length > 6
								? offer.city.slice(0, 6) + "..."
								: offer.city
						}}
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
						<button @click="linkToOfferUpdate(offer.id)" class="btn btn-green">
							Voir / Modifier
						</button>
					</td>

					<td>
						<button @click="confirmDelete(offer.id)" class="btn btn-red">
							Supprimer
						</button>
					</td>
				</tr>
			</tbody>
		</table>
	</main>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted, ref, type Ref } from "vue";
import Thumbnail from "../../components/offers/Thumbnail.vue";
import { useRouter } from "vue-router";
import type { IOfferRes } from "../../interfaces/IOffer";

let offersList: Ref<IOfferRes[]> = ref([]);

const getOffersList = () => {
	axios.get(`${import.meta.env.VITE_URL_BACK}/offers`).then((res) => {
		offersList.value = res.data;
	});
};

onMounted(() => {
	getOffersList();
});

const router = useRouter();

const linkToOfferUpdate = (offerId: number) => {
	router.push(`/dashboard/offersList/${offerId}`);
};

const confirmDelete = (id: number) => {
	const confirmed = confirm(`Voulez-vous vraiment supprimer l'offre ${id} ?`);
	if (confirmed) {
		deleteOffer(id);
	}
};

const deleteOffer = (id: number) => {
	axios
		.delete(`${import.meta.env.VITE_URL_BACK}/offers/${id}`)
		.then((res) => {
			getOffersList();
		})
		.catch((err) => {});
};
</script>
