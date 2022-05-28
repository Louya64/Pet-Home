<template>
	<header v-if="isAuthenticate">
		<div class="bg-slate-600 w-50 h-screen fixed top-0 text-white p-10">
			<button @click="logout">Se déconnecter</button>
			<nav>
				<RouterLink
					:to="{
						name: 'dashboardUserUpdate',
						params: { id: userAuthenticatedId },
					}"
					>Mon profil</RouterLink
				>
				<div class="my-5">
					<RouterLink to="/dashboard" class="text-2xl">Accueil</RouterLink>
				</div>

				<div class="my-5">
					<h2 class="text-2xl">Utilisateurs</h2>
					<div class="pl-5 flex flex-col">
						<RouterLink to="/dashboard/usersList">Voir la liste</RouterLink>
						<RouterLink v-if="isSuperAdmin" to="/dashboard/userCreate"
							>Créer un admin</RouterLink
						>
						<RouterLink v-if="isSuperAdmin" to="/dashboard/userRoles"
							>Liste des rôles</RouterLink
						>
					</div>
				</div>
				<div class="my-5">
					<h2 class="text-2xl">Annonces</h2>
					<div class="pl-5 flex flex-col">
						<RouterLink to="/dashboard/offers">Voir la liste</RouterLink>
						<RouterLink to="/dashboard/offerCreate"
							>Ajouter une annonce</RouterLink
						>
						<RouterLink to="/dashboard/categories"
							>Liste des catégories</RouterLink
						>
						<RouterLink to="/dashboard/races">Liste des races</RouterLink>
						<RouterLink v-if="isSuperAdmin" to="/dashboard/offerStatus"
							>Liste des status</RouterLink
						>
					</div>
				</div>
				<div class="my-5">
					<h2 class="text-2xl">Candidatures</h2>
					<div class="pl-5 flex flex-col">
						<RouterLink to="/dashboard/adoptionRequests"
							>Voir la liste</RouterLink
						>
						<RouterLink v-if="isSuperAdmin" to="/dashboard/adoptionStatus"
							>Liste des status</RouterLink
						>
					</div>
				</div>
			</nav>
		</div>
	</header>

	<RouterView />
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";

const router = useRouter();
const isSuperAdmin = ref(false);

if (localStorage.getItem("userRole") === "1") {
	isSuperAdmin.value = true;
}

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
</script>

<style>
@import "@/assets/base.css";
</style>
