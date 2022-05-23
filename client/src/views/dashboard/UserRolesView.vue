<template>
	<div class="dashboardContainer">
		<h1>Les rôles des utilisateurs</h1>
		<UserRoleCreateForm @requestResult="displayRequestResult" />
		<RequestResult :resultMessage="resultMessage" :success="requestSuccess" />
		<UserRoleTable
			:userRolesList="userRolesList"
			@requestResult="displayRequestResult"
			@orderBy="updateOrderBy"
		/>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import axios from "axios";
import UserRoleCreateForm from "@/components/userRoles/UserRoleCreateForm.vue";
import RequestResult from "@/components/commons/RequestResult.vue";
import UserRoleTable from "@/components/userRoles/UserRoleTable.vue";
import type { IUserRoleRes } from "@/interfaces/IUserRole";

let userRolesList: Ref<IUserRoleRes[]> = ref([]);
const orderBy = ref("");
const resultMessage = ref("");
const requestSuccess = ref(false);
console.log(userRolesList);

const displayRequestResult = (success: boolean, message: string) => {
	requestSuccess.value = success;
	resultMessage.value = message;
	if (success) {
		getUserRolesList();
	}
};

const updateOrderBy = (order: string) => {
	orderBy.value = `?orderBy=${order}`;
	getUserRolesList();
};

const getUserRolesList = () => {
	axios
		.get(`${import.meta.env.VITE_URL_BACK}/roles${orderBy.value}`)
		.then((res) => {
			userRolesList.value = res.data;
		});
};

onMounted(() => {
	getUserRolesList();
});
</script>
