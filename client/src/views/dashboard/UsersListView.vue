<template>
	<main class="dashboardContainer">
		<h1>Liste des utilisateurs</h1>
		<div class="flex items-end">
			<UserFilters @search="updateSearch" />
			<RequestResult :resultMessage="resultMessage" :success="requestSuccess" />
		</div>

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
import UserFilters from "@/components/users/UserFilters.vue";
import RequestResult from "@/components/commons/RequestResult.vue";
import type { IUserRes } from "@/interfaces/IUser";

const usersList: Ref<IUserRes[]> = ref([]);
const orderBy = ref("");
const search = ref("");
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
	if (search.value) {
		search.value = search.value.replace("?", "&");
	}
	getUsersList();
};

const updateSearch = (searchVal: string) => {
	if (searchVal) {
		search.value = orderBy.value
			? `&search=${searchVal}`
			: `?search=${searchVal}`;
	} else {
		search.value = "";
	}
	getUsersList();
};

const getUsersList = () => {
	axios
		.get(
			`${import.meta.env.VITE_URL_BACK}/users${orderBy.value}${search.value}`
		)
		.then((res) => {
			usersList.value = res.data;
		});
};

onMounted(() => {
	getUsersList();
});
</script>
