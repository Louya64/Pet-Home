<template>
	<table v-if="offerStatusList" class="mx-auto table-auto w-1/2">
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
			<OfferStatusTableRow
				v-for="offerStatus in offerStatusList"
				:offerStatus="offerStatus"
				@request-result="
					(success, message) => emit('requestResult', success, message)
				"
			/>
		</tbody>
	</table>
</template>

<script setup lang="ts">
import OfferStatusTableRow from "./OfferStatusTableRow.vue";
import OrderByArrow from "@/components/commons/OrderByArrow.vue";
import type { IOfferStatusRes } from "@/interfaces/IOfferStatus";
interface Props {
	offerStatusList: IOfferStatusRes[];
}
defineProps<Props>();
const emit = defineEmits<{
	(e: "requestResult", success: boolean, message: string): void;
	(e: "orderBy", order: string): void;
}>();
</script>
