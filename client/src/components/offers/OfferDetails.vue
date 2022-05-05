<template>
	<div v-if="offer" class="siteContainer">
		<h1>détails annonce {{ offer.id }}</h1>
	</div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, onMounted, type Ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

interface IOffer {
	id: number;
	creation_date: string;
	adoption_date: string | null;
	status: {
		name: string;
	};
	animal_name: string;
	age: number;
	category: {
		name: string;
	};
	race: {
		name: string;
	} | null;
	zipcode: number;
	city: string;
	identified: boolean;
	vaccinated: boolean;
	disabled: boolean;
	disability: string;
	description: string;
}

const offer: Ref<IOffer | undefined> = ref();

onMounted(() => {
	axios
		.get(`http://localhost:8080/offers/${route.params.id}`)
		.then((res) => (offer.value = res.data));
});
</script>
