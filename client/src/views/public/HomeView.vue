<template>
	<main class="siteContainer">
		<Slides />
		<h1>Bienvenue chez Pet'Home</h1>
		<div class="px-32">
			<About />
			<Statistics />
			<LastOffers />
		</div>
	</main>
</template>

<script setup lang="ts">
import Slides from "@/components/homeSite/Slides.vue";
import About from "@/components/homeSite/About.vue";
import Statistics from "@/components/homeSite/Statistics.vue";
import LastOffers from "@/components/homeSite/LastOffers.vue";
</script>
