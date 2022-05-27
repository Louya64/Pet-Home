<template>
	<table v-if="adoptionStatusList" class="mx-auto table-auto w-1/2">
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
				<td></td>
				<td></td>
			</tr>
		</thead>
		<tbody>
			<AdoptionStatusTableRow
				v-for="adoptionStatus in adoptionStatusList"
				:adoptionStatus="adoptionStatus"
				@request-result="
					(success, message) => emit('requestResult', success, message)
				"
			/>
		</tbody>
	</table>
</template>

<script setup lang="ts">
import AdoptionStatusTableRow from "./AdoptionStatusTableRow.vue";
import OrderByArrow from "@/components/commons/OrderByArrow.vue";
import type { IAdoptionStatusRes } from "@/interfaces/IAdoptionStatus";
interface Props {
	adoptionStatusList: IAdoptionStatusRes[];
}
defineProps<Props>();
const emit = defineEmits<{
	(e: "requestResult", success: boolean, message: string): void;
	(e: "orderBy", order: string): void;
}>();
</script>
