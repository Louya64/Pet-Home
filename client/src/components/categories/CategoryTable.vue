<template>
	<table v-if="categoriesList" class="mx-auto table-auto w-1/2">
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
						Catégorie Parente
						<OrderByArrow
							fieldName="id_parent_category"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td></td>
				<td></td>
			</tr>
		</thead>
		<tbody>
			<CategoryTableRow
				v-for="category in categoriesList"
				:category="category"
				:categoriesList="categoriesList"
				@request-result="
					(success, message) => emit('requestResult', success, message)
				"
			/>
		</tbody>
	</table>
</template>

<script setup lang="ts">
import CategoryTableRow from "./CategoryTableRow.vue";
import OrderByArrow from "../commons/OrderByArrow.vue";

interface Props {
	categoriesList: ICategory[];
}
interface ICategory {
	id: number;
	name: string;
	id_parent_category: number | null;
}

defineProps<Props>();
const emit = defineEmits<{
	(e: "requestResult", success: boolean, message: string): void;
	(e: "orderBy", order: string): void;
}>();
</script>
