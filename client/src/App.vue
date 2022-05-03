<template>
	<DashboardSidebar v-if="admin" />
	<PetHomeHeader v-else />
</template>

<script setup lang="ts">
import PetHomeHeader from "./components/PetHomeHeader.vue";
import DashboardSidebar from "./components/DashboardSidebar.vue";
import { ref, type Ref } from "vue";
import jwt_decode from "jwt-decode";

interface ITokenDecoded {
	id: number;
	role: number;
	iat: number;
}

const admin = ref(false);

const isAuthenticate: Ref<string | null> = ref(
	localStorage.getItem("token") ? localStorage.getItem("token") : null
);

window.addEventListener("storage", () => {
	isAuthenticate.value = localStorage.getItem("token");
	if (isAuthenticate.value) {
		const tokenDecoded: ITokenDecoded = jwt_decode(isAuthenticate.value);
		if (tokenDecoded.role === 1 || tokenDecoded.role === 2) {
			admin.value = true;
		} else {
			admin.value = false;
		}
	} else {
		admin.value = false;
	}
});
</script>

<style>
@import "@/assets/base.css";
</style>
