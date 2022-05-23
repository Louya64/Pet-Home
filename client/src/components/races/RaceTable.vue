<template>
	<table v-if="racesList" class="mx-auto table-auto w-1/2">
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
						Nom
						<div>
							<OrderByArrow
								fieldName="name"
								@arrow-clicked="(order) => emit('orderBy', order)"
							/>
						</div>
					</div>
				</td>
				<td>
					<div class="flex justify-between items-center">
						Catégorie
						<OrderByArrow
							fieldName="id_category"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td></td>
				<td></td>
			</tr>
		</thead>
		<tbody>
			<RaceTableRow
				v-for="race in racesList"
				:race="race"
				:categoriesList="categoriesList"
				@request-result="
					(success, message) => emit('requestResult', success, message)
				"
			/>
		</tbody>
	</table>
</template>

<script setup lang="ts">
import RaceTableRow from "./RaceTableRow.vue";
import OrderByArrow from "@/components/commons/OrderByArrow.vue";
import type { IRaceRes } from "@/interfaces/IRace";
import type { ICategoryRes } from "@/interfaces/ICategory";

interface Props {
	racesList: IRaceRes[];
	categoriesList: ICategoryRes[];
}

defineProps<Props>();
const emit = defineEmits<{
	(e: "requestResult", success: boolean, message: string): void;
	(e: "orderBy", order: string): void;
}>();
</script>
