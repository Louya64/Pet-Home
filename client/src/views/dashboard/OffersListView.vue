<template>
	<main class="dashboardContainer">
		<h1>Liste des annonces</h1>
		<div class="flex items-end">
			<DashboardOfferFilters @search="updateSearch" />
			<RequestResult :resultMessage="resultMessage" :success="requestSuccess" />
		</div>
		<OfferTable
			:offersList="offersList"
			@orderBy="updateOrderBy"
			@requestResult="displayRequestResult"
		/>
	</main>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted, onUnmounted, ref, type Ref } from "vue";
import OfferTable from "@/components/offers/OfferTable.vue";
import DashboardOfferFilters from "@/components/offers/DashboardOfferFilters.vue";
import RequestResult from "@/components/commons/RequestResult.vue";
import type { IOfferRes } from "@/interfaces/IOffer";

const offersList: Ref<IOfferRes[]> = ref([]);
const orderBy = ref("");
const search = ref("");
const resultMessage = ref("");
const requestSuccess = ref(false);
let offset = 0;

const displayRequestResult = (success: boolean, message: string) => {
	requestSuccess.value = success;
	resultMessage.value = message;
	if (success) {
		getOffersList(true);
	}
};

const updateOrderBy = (order: string) => {
	orderBy.value = `?orderBy=${order}`;
	if (search.value) {
		search.value = search.value.replace("?", "&");
	}
	getOffersList(true);
};

const updateSearch = (
	fieldname: string,
	searchVal: string,
	searchType: string
) => {
	if (searchVal && searchType === "contains") {
		search.value = orderBy.value
			? `&search=${fieldname}-${searchVal}`
			: `?search=${fieldname}-${searchVal}`;
	} else if (searchVal && searchType === "equal") {
		search.value = orderBy.value
			? `&${fieldname}=${searchVal}`
			: `?${fieldname}=${searchVal}`;
	} else {
		search.value = "";
	}
	getOffersList(true);
};

const getOffersList = (firstReq: boolean) => {
	if (firstReq) {
		offset = 0;
	}
	const limit =
		orderBy.value || search.value
			? `&limit=15&offset=${offset}`
			: `?limit=15&offset=${offset}`;

	axios
		.get(
			`${import.meta.env.VITE_URL_BACK}/offers${orderBy.value}${
				search.value
			}${limit}`
		)
		.then((res) => {
			if (firstReq) {
				offersList.value = res.data.offers;
			} else {
				offersList.value = [...offersList.value, ...res.data.offers];
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
		getOffersList(false);
		setTimeout(() => {
			window.addEventListener("scroll", handleScroll);
		}, 500);
	}
};

onMounted(() => {
	getOffersList(true);
	window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll);
});
</script>
