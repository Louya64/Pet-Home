<template>
	<header
		class="main-bg-color main-color flex justify-between fixed top-0 w-screen h-[10vh] z-10"
	>
		<nav
			class="w-4/5 flex justify-evenly items-center border-r-2 border-slate-500"
		>
			<RouterLink to="/">Accueil = Logo ?</RouterLink>
			<RouterLink to="/offers">Les animaux à adopter</RouterLink>
			<RouterLink to="/about">Contactez-nous</RouterLink>
		</nav>
		<div class="flex justify-around items-center w-1/5">
			<!-- v-if !auth -->
			<RouterLink
				v-if="!isAuthenticate"
				to="/auth"
				class="w-full h-full flex justify-center items-center"
			>
				<button class="w-full h-full hover:main-bg-color-darker">
					Se connecter /<br />
					Créer un compte
				</button>
			</RouterLink>
			<!-- v-else -->
			<div v-else class="w-full h-full flex">
				<div
					class="w-1/3 flex flex-col justify-center items-center h-full hover:main-bg-color-darker hover:cursor-pointer"
				>
					icon
					<button>Profil</button>
				</div>
				<div
					class="w-1/3 flex flex-col justify-center items-center h-full hover:main-bg-color-darker hover:cursor-pointer"
				>
					icon
					<button>Messagerie</button>
				</div>
				<div
					@click="logout"
					class="w-1/3 flex flex-col justify-center items-center h-full hover:main-bg-color-darker hover:cursor-pointer"
				>
					icon
					<button>Logout</button>
				</div>
			</div>
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
	router.push("/");
};
</script>

<style>
@import "@/assets/base.css";
</style>
