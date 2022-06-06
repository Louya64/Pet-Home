<template>
	<div class="siteContainer">
		<h1>Modifier mon profil</h1>
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
