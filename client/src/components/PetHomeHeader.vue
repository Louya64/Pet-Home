<template>
	<header
		class="main-bg-color main-color flex justify-between fixed top-0 w-screen h-[10vh] z-10"
	>
		<nav
			class="w-4/5 flex justify-evenly items-center border-r-2 border-slate-500"
		>
			<RouterLink to="/"
				><img
					width="100"
					src="/dog-1532627.svg"
					alt="logo"
					title="Revenir à l'accueil"
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
					<button>Profil</button>
				</RouterLink>
				<RouterLink
					to="/myAdoptionRequests"
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
				</RouterLink>
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
import type { IAdoptionRequestRes } from "@/interfaces/IAdoptionRequest";
import axios from "axios";

const router = useRouter();
const isAuthenticate: Ref<string | null> = ref(
	localStorage.getItem("token") ? localStorage.getItem("token") : null
);
const userAuthenticatedId: Ref<string | null> = ref(
	localStorage.getItem("userId") ? localStorage.getItem("userId") : null
);
const newMessage: Ref<string | null> = ref(
	localStorage.getItem("newMessage") ? localStorage.getItem("newMessage") : null
);

const getUnredMessages = async () => {
	if (userAuthenticatedId.value) {
		await axios
			.get(
				`${import.meta.env.VITE_URL_BACK}/adoptionRequests?userId=${
					userAuthenticatedId.value
				}`
			)
			.then((res) => {
				const idReqArray = res.data.map(
					(adoptionReq: IAdoptionRequestRes) => adoptionReq.id
				);
				axios
					.get(
						`${
							import.meta.env.VITE_URL_BACK
						}/messages?idReqIn=${idReqArray}&authorRole=!3&seen=false`
					)
					.then((res) => {
						if (res.data.length) {
							localStorage.setItem("newMessage", "yes");
							newMessage.value = localStorage.getItem("newMessage");
						} else {
							localStorage.removeItem("newMessage");
							newMessage.value = null;
						}
					});
			});
	}
};
getUnredMessages();

window.addEventListener("storage", () => {
	isAuthenticate.value = localStorage.getItem("token");
	userAuthenticatedId.value = localStorage.getItem("userId");
	newMessage.value = localStorage.getItem("newMessage");
	getUnredMessages();
});

const logout = () => {
	localStorage.removeItem("token");
	localStorage.removeItem("userRole");
	localStorage.removeItem("userId");
	localStorage.removeItem("userUsername");
	localStorage.removeItem("newMessage");
	window.dispatchEvent(new Event("storage"));
	router.push("/auth");
};

const showCategories = ref(false);
const categoriesList: Ref<ICategoryRes[]> = ref([]);
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
