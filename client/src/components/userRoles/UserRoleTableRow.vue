<template>
	<tr>
		<td>{{ userRole.id }}</td>
		<td>
			<input
				:class="[updating ? 'bg-slate-600 text-white' : 'bg-transparent']"
				class="w-full p-1"
				type="text"
				v-model="userRole.name"
				:disabled="!updating"
			/>
		</td>
		<td>
			<div class="flex justify-center">
				<button @click="toggleUpdating(userRole)" class="btn btn-green">
					{{ updating ? "Valider" : "Modifier" }}
				</button>
			</div>
		</td>
		<td>
			<div class="flex justify-center">
				<button @click="confirmDelete(userRole)" class="btn btn-red">
					Supprimer
				</button>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import type { IUserRoleRes } from "@/interfaces/IUserRole";

interface Props {
	userRole: IUserRoleRes;
}

defineProps<Props>();
const emit = defineEmits<{
	(e: "requestResult", success: boolean, message: string): void;
}>();

const updating = ref(false);

const toggleUpdating = (userRole: IUserRoleRes) => {
	if (!updating.value) {
		updating.value = true;
	} else {
		updating.value = false;
		axios
			.request({
				method: "put",
				url: `${import.meta.env.VITE_URL_BACK}/roles/${userRole.id}`,
				data: userRole,
			})
			.then((res) => {
				emit(
					"requestResult",
					true,
					`Le rôle ${userRole.name} a bien été mis à jour`
				);
			})
			.catch((err) => {
				emit("requestResult", false, err.response.data.message);
			});
	}
};

const confirmDelete = (userRole: IUserRoleRes) => {
	const confirmed = confirm(
		`Voulez-vous vraiment supprimer le rôle ${userRole.name} ?`
	);
	if (confirmed) {
		deleteUserRole(userRole);
	}
};

const deleteUserRole = (userRole: IUserRoleRes) => {
	axios
		.delete(`${import.meta.env.VITE_URL_BACK}/roles/${userRole.id}`)
		.then(() => {
			emit(
				"requestResult",
				true,
				`Le rôle ${userRole.name} a bien été supprimé`
			);
		})
		.catch((err) => {
			emit("requestResult", false, err.response.data.message);
		});
};
</script>
