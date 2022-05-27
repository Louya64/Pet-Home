<template>
	<header
		class="main-bg-color main-color flex justify-between fixed top-0 w-screen h-[10vh] z-10"
	>
		<nav
			class="w-4/5 flex justify-evenly items-center border-r-2 border-slate-500"
		>
			<RouterLink to="/" title="Revenir à l'accueil"
				><img width="100" src="/dog-1532627.svg" alt=""
			/></RouterLink>
			<div class="relative">
				<div class="flex">
					<div @click="categoryIsSelected">
						<RouterLink to="/offers">Les animaux à adopter</RouterLink>
					</div>

					<div class="pl-5">
						<font-awesome-icon
							v-if="!showCategories"
							class="mt-1 hover:cursor-pointer"
							icon="chevron-down"
							@click="() => (showCategories = true)"
						/>
						<font-awesome-icon
							v-if="showCategories"
							class="mt-1 hover:cursor-pointer"
							icon="chevron-up"
							@click="() => (showCategories = false)"
						/>
					</div>
				</div>
				<ul v-if="showCategories" class="absolute w-full p-2 bg-slate-700">
					<li
						class="hover:cursor-pointer hover:bg-orange-100"
						v-for="category in categoriesList"
						@click="categoryIsSelected"
					>
						<RouterLink
							:key="category.name"
							:to="`/offers?categoryId=${category.id}&categoryName=${category.name}`"
							>{{ category.name }}</RouterLink
						>
					</li>
				</ul>
			</div>

			<RouterLink to="/contact">Contactez-nous</RouterLink>
		</nav>
		<div class="flex justify-around items-center w-1/5">
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
			<div v-else class="w-full h-full flex">
				<RouterLink
					class="w-1/3 flex flex-col justify-center items-center h-full hover:main-bg-color-darker hover:cursor-pointer"
					:to="{
						name: 'userProfile',
						params: { id: userAuthenticatedId },
					}"
				>
					<font-awesome-icon class="text-2xl" icon="user" />
					Mon profil
				</RouterLink>

				<div
					class="w-1/3 flex flex-col justify-center items-center h-full hover:main-bg-color-darker hover:cursor-pointer"
				>
					<div class="relative">
						<font-awesome-icon class="text-xl" icon="message" />
						<font-awesome-icon
							v-if="newMessage"
							class="text-xs text-red-500 absolute -top-1 -right-1"
							icon="circle"
						/>
					</div>

					<button>Messagerie</button>
				</div>
				<div
					@click="logout"
					class="w-1/3 flex flex-col justify-center items-center h-full hover:main-bg-color-darker hover:cursor-pointer"
				>
					<font-awesome-icon class="text-2xl" icon="right-from-bracket" />
					<button>Logout</button>
				</div>
			</div>
		</div>
	</header>

	<router-view v-slot="{ Component, route }">
		<transition name="fade">
			<component :is="Component" :key="route.query" />
		</transition>
	</router-view>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import type { ICategoryRes } from "../interfaces/ICategory";
import axios from "axios";

if (
	localStorage.theme === "dark" ||
	(!("theme" in localStorage) &&
		window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
	document.documentElement.classList.add("dark");
} else {
	document.documentElement.classList.remove("dark");
}

const newMessage = ref(false);
const router = useRouter();
const isAuthenticate: Ref<string | null> = ref(
	localStorage.getItem("token") ? localStorage.getItem("token") : null
);

const userAuthenticatedId: Ref<string | null> = ref(
	localStorage.getItem("userId") ? localStorage.getItem("userId") : null
);

window.addEventListener("storage", () => {
	isAuthenticate.value = localStorage.getItem("token");
	userAuthenticatedId.value = localStorage.getItem("userId");
});

const logout = () => {
	localStorage.removeItem("token");
	localStorage.removeItem("userRole");
	localStorage.removeItem("userId");
	window.dispatchEvent(new Event("storage"));
	router.push("/auth");
};

const showCategories = ref(false);
let categoriesList: Ref<ICategoryRes[]> = ref([]);
onMounted(() => {
	axios.get(`${import.meta.env.VITE_URL_BACK}/categories`).then((res) => {
		categoriesList.value = res.data;
	});
});
const categoryIsSelected = () => {
	showCategories.value = false;
};
</script>

<style>
@import "@/assets/base.css";
</style>
