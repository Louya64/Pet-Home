<template>
	<div class="dashboardContainer" v-if="user">
		<h1>
			{{
				user.id === Number(watcherId)
					? "Modifier mon profil"
					: `Détails du profil ${user.id}`
			}}
		</h1>
		<UserForm v-if="user" :user="user" />
	</div>
</template>

<script setup lang="ts">
import UserForm from "@/components/users/UserForm.vue";
import axios from "axios";
import { ref, onMounted, type Ref } from "vue";
import { useRoute } from "vue-router";
import type { IUserRes } from "@/interfaces/IUser";

const route = useRoute();
const user: Ref<IUserRes | undefined> = ref();
const watcherId: Ref<string | null> = ref(
	localStorage.getItem("userId") ? localStorage.getItem("userId") : null
);

onMounted(() => {
	axios
		.get(`${import.meta.env.VITE_URL_BACK}/users/${route.params.id}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
		.then((res) => {
			user.value = res.data;
		});
});
</script>
