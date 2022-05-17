<template>
	<DashboardSidebar v-if="isAdmin" />
	<PetHomeHeader v-else />
</template>

<script setup lang="ts">
import PetHomeHeader from "./components/PetHomeHeader.vue";
import DashboardSidebar from "./components/DashboardSidebar.vue";
import { ref } from "vue";
import jwt_decode from "jwt-decode";
import type { ITokenDecoded } from "./interfaces/ITokenDecoded";

const isAdmin = ref(false);
let token = localStorage.getItem("token");

const checkIsAdmin = () => {
	if (token) {
		const tokenDecoded: ITokenDecoded = jwt_decode(token);
		if (tokenDecoded.role === 1 || tokenDecoded.role === 2) {
			isAdmin.value = true;
		} else {
			isAdmin.value = false;
		}
	} else {
		isAdmin.value = false;
	}
};

checkIsAdmin();

window.addEventListener("storage", () => {
	token = localStorage.getItem("token");
	checkIsAdmin();
});
</script>

<style>
@import "@/assets/base.css";
</style>
