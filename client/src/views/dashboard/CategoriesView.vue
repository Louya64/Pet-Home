<template>
	<div class="dashboardContainer">
		<h1>Les catégories d'animaux</h1>
		<CategoryCreateForm
			:categoriesList="categoriesList"
			@requestResult="displayRequestResult"
		/>
		<RequestResult :resultMessage="resultMessage" :success="requestSuccess" />
		<CategoryTable
			:categoriesList="categoriesList"
			@requestResult="displayRequestResult"
			@orderBy="updateOrderBy"
		/>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import axios from "axios";
import CategoryCreateForm from "../../components/categories/CategoryCreateForm.vue";
import RequestResult from "../../components/commons/RequestResult.vue";
import CategoryTable from "../../components/categories/CategoryTable.vue";

interface ICategory {
	id: number;
	name: string;
	id_parent_category: number | null;
}

let categoriesList: Ref<ICategory[]> = ref([]);
const orderBy = ref("");
const resultMessage = ref("");
const requestSuccess = ref(false);

const displayRequestResult = (success: boolean, message: string) => {
	requestSuccess.value = success;
	resultMessage.value = message;
	if (success) {
		getCategoriesList();
	}
};

const updateOrderBy = (order: string) => {
	orderBy.value = `?orderBy=${order}`;
	getCategoriesList();
};

const getCategoriesList = () => {
	axios
		.get(`${import.meta.env.VITE_URL_BACK}/categories${orderBy.value}`)
		.then((res) => {
			categoriesList.value = res.data;
		});
};

onMounted(() => {
	getCategoriesList();
});
</script>
