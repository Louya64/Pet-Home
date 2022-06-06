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
import { onMounted, onUnmounted, ref, type Ref } from "vue";
import UserTable from "@/components/users/UserTable.vue";
import UserFilters from "@/components/users/UserFilters.vue";
import RequestResult from "@/components/commons/RequestResult.vue";
import type { IUserRes } from "@/interfaces/IUser";

const usersList: Ref<IUserRes[]> = ref([]);
const orderBy = ref("");
const search = ref("");
const resultMessage = ref("");
const requestSuccess = ref(false);
let offset = 0;

const displayRequestResult = (success: boolean, message: string) => {
	requestSuccess.value = success;
	resultMessage.value = message;
	if (success) {
		getUsersList(true);
	}
};

const updateOrderBy = (order: string) => {
	orderBy.value = `?orderBy=${order}`;
	if (search.value) {
		search.value = search.value.replace("?", "&");
	}
	getUsersList(true);
};

const updateSearch = (searchVal: string) => {
	if (searchVal) {
		search.value = orderBy.value
			? `&search=${searchVal}`
			: `?search=${searchVal}`;
	} else {
		search.value = "";
	}
	getUsersList(true);
};

const getUsersList = (firstReq: boolean) => {
	if (firstReq) {
		offset = 0;
	}
	const limit =
		orderBy.value || search.value
			? `&limit=15&offset=${offset}`
			: `?limit=15&offset=${offset}`;
	axios
		.get(
			`${import.meta.env.VITE_URL_BACK}/users${orderBy.value}${
				search.value
			}${limit}`
		)
		.then((res) => {
			if (firstReq) {
				usersList.value = res.data;
			} else {
				usersList.value = [...usersList.value, ...res.data];
			}
		});
};

const handleScroll = () => {
	let bottomOfWindow =
		document.documentElement.scrollTop + window.innerHeight ===
		document.documentElement.offsetHeight;

	if (bottomOfWindow) {
		window.removeEventListener("scroll", handleScroll);
		offset += 15;
		getUsersList(false);
		setTimeout(() => {
			window.addEventListener("scroll", handleScroll);
		}, 500);
	}
};

onMounted(() => {
	getUsersList(true);
	window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll);
});
</script>
