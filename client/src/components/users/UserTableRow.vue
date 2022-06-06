<template>
	<tr>
		<td>{{ user.id }}</td>
		<td>
			{{ user.creation_date.slice(0, 10).split("-").reverse().join("/") }}
		</td>
		<td>
			{{ user.role.name }}
		</td>
		<td>
			{{
				user.email
					? user.email.length > 10
						? user.email.slice(0, 10) + "..."
						: user.email
					: ""
			}}
		</td>
		<td>
			{{
				user.username
					? user.username.length > 10
						? user.username.slice(0, 10) + "..."
						: user.username
					: ""
			}}
		</td>
		<td>
			{{
				user.lastname
					? user.lastname.length > 10
						? user.lastname.slice(0, 10) + "..."
						: user.lastname
					: ""
			}}
		</td>
		<td>
			{{
				user.firstname
					? user.firstname.length > 10
						? user.firstname.slice(0, 10) + "..."
						: user.firstname
					: ""
			}}
		</td>
		<td>{{ user.phone_number }}</td>
		<td>
			<button
				@click="router.push(`/dashboard/usersList/${user.id}`)"
				class="btn btn-green"
			>
				Détails
			</button>
		</td>
		<td>
			<button
				v-if="isSuperAdmin || user.id_role === 3"
				@click="confirmDelete(user.id)"
				class="btn btn-red"
			>
				Supprimer
			</button>
		</td>
	</tr>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { IUserRes } from "@/interfaces/IUser";
import axios from "axios";
import { useRouter } from "vue-router";

interface Props {
	user: IUserRes;
}

defineProps<Props>();
const emit = defineEmits<{
	(e: "requestResult", success: boolean, message: string): void;
}>();

const router = useRouter();
const isSuperAdmin = ref(false);
if (localStorage.getItem("userRole") === "1") {
	isSuperAdmin.value = true;
}

const confirmDelete = (id: number) => {
	const confirmed = confirm(
		`Voulez-vous vraiment supprimer l'utilisateur ${id} ?`
	);
	if (confirmed) {
		deleteUser(id);
	}
};

const deleteUser = (id: number) => {
	axios
		.delete(`${import.meta.env.VITE_URL_BACK}/users/${id}`)
		.then(() => {
			emit("requestResult", true, `L'utilisateur ${id} a bien été supprimé`);
		})
		.catch((err) => {
			emit("requestResult", false, err.response.data.message);
		});
};
</script>
