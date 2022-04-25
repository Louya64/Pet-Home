<template>
	<header v-if="isAuthenticate">
		<div class="wrapper">
			<button @click="logout">Logout</button>
			<nav>
				<RouterLink to="/dashboard">Home</RouterLink>
			</nav>
		</div>
	</header>

	<RouterView />
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
const router = useRouter();

const isAuthenticate: Ref<string | null> = ref(
	localStorage.getItem("token") ? localStorage.getItem("token") : null
);

window.addEventListener("storage", () => {
	isAuthenticate.value = localStorage.getItem("token");
});

const logout = () => {
	localStorage.removeItem("token");
	window.dispatchEvent(new Event("storage"));
	router.push("/dashboard/login");
};
</script>

<style>
@import "@/assets/base.css";
</style>
