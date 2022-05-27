<template>
	<table v-if="adoptionRequestsList" class="mx-auto table-auto w-1/2 mt-20">
		<thead>
			<tr>
				<td>
					<div class="flex justify-between items-center">
						Id
						<OrderByArrow
							fieldName="id"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td>
					<div class="flex justify-between items-center">
						Créat
						<div>
							<OrderByArrow
								fieldName="creation_date"
								@arrow-clicked="(order) => emit('orderBy', order)"
							/>
						</div>
					</div>
				</td>
				<td>
					<div class="flex justify-between items-center">
						Statut
						<div>
							<OrderByArrow
								fieldName="id_adoption_status"
								@arrow-clicked="(order) => emit('orderBy', order)"
							/>
						</div>
					</div>
				</td>
				<td>
					<div class="flex justify-between items-center">
						Annonce n°
						<div>
							<OrderByArrow
								fieldName="id_offer"
								@arrow-clicked="(order) => emit('orderBy', order)"
							/>
						</div>
					</div>
				</td>
				<td>
					<div class="flex justify-between items-center">
						C.email
						<div>
							<OrderByArrow
								fieldName="candidate_email"
								@arrow-clicked="(order) => emit('orderBy', order)"
							/>
						</div>
					</div>
				</td>
				<td>
					<div class="flex justify-between items-center">
						C.tel
						<div>
							<OrderByArrow
								fieldName="candidate_phone"
								@arrow-clicked="(order) => emit('orderBy', order)"
							/>
						</div>
					</div>
				</td>
				<td>
					<div class="flex justify-between items-center">
						C.Id
						<div>
							<OrderByArrow
								fieldName="id_candidate"
								@arrow-clicked="(order) => emit('orderBy', order)"
							/>
						</div>
					</div>
				</td>
				<td></td>
			</tr>
		</thead>
		<tbody>
			<AdoptionRequestTableRow
				v-for="adoptionRequest in adoptionRequestsList"
				:adoptionRequest="adoptionRequest"
			/>
		</tbody>
	</table>
</template>

<script setup lang="ts">
import AdoptionRequestTableRow from "./AdoptionRequestTableRow.vue";
import OrderByArrow from "@/components/commons/OrderByArrow.vue";
import type { IAdoptionRequestRes } from "@/interfaces/IAdoptionRequest";

interface Props {
	adoptionRequestsList: IAdoptionRequestRes[];
}

defineProps<Props>();

const emit = defineEmits<{
	(e: "orderBy", order: string): void;
}>();
</script>
