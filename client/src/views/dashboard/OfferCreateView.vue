<template>
	<div class="dashboardContainer">
		<h1>Ajouter une annonce</h1>
		<OfferForm :offer="null" />
	</div>
</template>

<script setup lang="ts">
import OfferForm from "@/components/offers/OfferForm.vue";
</script>
