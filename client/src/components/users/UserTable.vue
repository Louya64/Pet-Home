<template>
	<table
		v-if="usersList"
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
				<td title="date de création">
					<div class="flex justify-between items-center">
						Creat
						<OrderByArrow
							fieldName="creation_date"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td>
					<div class="flex justify-between items-center">
						Rôle
						<OrderByArrow
							fieldName="id_role"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td>
					<div class="flex justify-between items-center">
						Email
						<OrderByArrow
							fieldName="email"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td>
					<div class="flex justify-between items-center">
						Pseudonyme
						<OrderByArrow
							fieldName="username"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td>
					<div class="flex justify-between items-center">
						Nom de famille
						<OrderByArrow
							fieldName="lastname"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td>
					<div class="flex justify-between items-center">
						Prénom
						<OrderByArrow
							fieldName="firstname"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<td>
					<div class="flex justify-between items-center">
						Téléphone
						<OrderByArrow
							fieldName="phone_number"
							@arrow-clicked="(order) => emit('orderBy', order)"
						/>
					</div>
				</td>
				<!-- <td></td> -->
				<td></td>
			</tr>
		</thead>
		<tbody>
			<UserTableRow
				v-for="user in usersList"
				:user="user"
				@request-result="
					(success, message) => emit('requestResult', success, message)
				"
			/>
		</tbody>
	</table>
</template>

<script setup lang="ts">
import type { IUserRes } from "@/interfaces/IUser";
import OrderByArrow from "@/components/commons/OrderByArrow.vue";
import UserTableRow from "./UserTableRow.vue";

interface Props {
	usersList: IUserRes[];
}

defineProps<Props>();

const emit = defineEmits<{
	(e: "requestResult", success: boolean, message: string): void;
	(e: "orderBy", order: string): void;
}>();
</script>
