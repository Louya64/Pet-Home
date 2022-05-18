<template>
	<table
		v-if="offersList"
		class="w-full border-collapse border table-auto border-slate-500 text-center"
	>
		<thead>
			<tr class="text-xs">
				<td>
					<div class="flex justify-between items-center">
						Id
						<OrderByArrow
							fieldName="id"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td>Photo</td>
				<td title="date de création">
					<div class="flex justify-between items-center">
						Creat
						<OrderByArrow
							fieldName="creation_date"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td title="date d'adoption">
					<div class="flex justify-between items-center">
						Adopt
						<OrderByArrow
							fieldName="adoption_date"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td>
					<div class="flex justify-between items-center">
						statut
						<OrderByArrow
							fieldName="id_status"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td title="nom de l'animal">
					<div class="flex justify-between items-center">
						Nom
						<OrderByArrow
							fieldName="animal_name"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td>
					<div class="flex justify-between items-center">
						age
						<OrderByArrow
							fieldName="age"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td title="catégorie">
					<div class="flex justify-between items-center">
						Cat
						<OrderByArrow
							fieldName="id_category"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td>
					<div class="flex justify-between items-center">
						race
						<OrderByArrow
							fieldName="id_race"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td title="code postal">
					<div class="flex justify-between items-center">
						CP
						<OrderByArrow
							fieldName="zipcode"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td>
					<div class="flex justify-between items-center">
						ville
						<OrderByArrow
							fieldName="city"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td title="identifié ?">
					<div class="flex justify-between items-center">
						Id ?
						<OrderByArrow
							fieldName="identified"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td title="vacciné ?">
					<div class="flex justify-between items-center">
						Vac ?
						<OrderByArrow
							fieldName="vaccinated"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td title="handicapé ?">
					<div class="flex justify-between items-center">
						Hand ?
						<OrderByArrow
							fieldName="disabled"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td title="type de handicap">
					<div class="flex justify-between items-center">
						Handicap
						<OrderByArrow
							fieldName="disability"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td>description</td>
				<td></td>
				<td></td>
			</tr>
		</thead>
		<tbody>
			<OfferTableRow
				v-for="offer in offersList"
				:offer="offer"
				@request-result="
					(success, message) => emit('requestResult', success, message)
				"
			/>
		</tbody>
	</table>
</template>

<script setup lang="ts">
import type { IOfferRes } from "@/interfaces/IOffer";
import OrderByArrow from "@/components/commons/OrderByArrow.vue";
import OfferTableRow from "./OfferTableRow.vue";

interface Props {
	offersList: IOfferRes[];
}

defineProps<Props>();

const emit = defineEmits<{
	(e: "requestResult", success: boolean, message: string): void;
	(e: "orderBy", order: string): void;
}>();
</script>
