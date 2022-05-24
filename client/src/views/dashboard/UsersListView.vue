<template>
	<main class="dashboardContainer">
		<h1>Liste des utilisateurs</h1>
		<RequestResult :resultMessage="resultMessage" :success="requestSuccess" />
		<UserTable
			:usersList="usersList"
			@orderBy="updateOrderBy"
			@requestResult="displayRequestResult"
		/>
	</main>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted, ref, type Ref } from "vue";
import UserTable from "@/components/users/UserTable.vue";
import RequestResult from "@/components/commons/RequestResult.vue";
import type { IUserRes } from "@/interfaces/IUser";

let usersList: Ref<IUserRes[]> = ref([]);
const orderBy = ref("");
const resultMessage = ref("");
const requestSuccess = ref(false);

const displayRequestResult = (success: boolean, message: string) => {
	requestSuccess.value = success;
	resultMessage.value = message;
	if (success) {
		getUsersList();
	}
};

const updateOrderBy = (order: string) => {
	orderBy.value = `?orderBy=${order}`;
	getUsersList();
};

const getUsersList = () => {
	axios
		.get(`${import.meta.env.VITE_URL_BACK}/users${orderBy.value}`)
		.then((res) => {
			usersList.value = res.data;
		});
};

onMounted(() => {
	getUsersList();
});
</script>
