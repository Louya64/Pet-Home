<template>
	<form
		@submit.prevent="sendSearch"
		class="bg-slate-700 min-w-fit p-5 border-2 m-2"
	>
		<div class="flex w-full justify-between">
			<h2 class="text-lg">Rechercher par</h2>
			<font-awesome-icon
				title="remettre les filtres à 0"
				@click="resetSearch"
				class="text-2xl -mb-1 hover:cursor-pointer"
				icon="xmark"
			/>
		</div>
		<div>
			<select class="form-item-input text-sm" v-model="fieldnameVal">
				<option value="">Colonne</option>
				<option value="email">Email</option>
				<option value="username">Pseudonyme</option>
				<option value="lastname">Nom</option>
				<option value="firstname">Prénom</option>
			</select>
			<span> contenant </span>
			<input class="form-item-input text-sm" type="text" v-model="searchVal" />
		</div>
		<div class="flex justify-end">
			<button type="submit" class="btn btn-green">Rechercher</button>
		</div>
	</form>
</template>

<script setup lang="ts">
import { ref } from "vue";

const fieldnameVal = ref("");
const searchVal = ref("");

const emit = defineEmits<{
	(e: "search", search: string): void;
}>();

const sendSearch = () => {
	if (fieldnameVal.value && searchVal.value) {
		emit("search", fieldnameVal.value + "-" + searchVal.value);
	} else {
		emit("search", "");
	}
};

const resetSearch = () => {
	emit("search", "");
	fieldnameVal.value = "";
	searchVal.value = "";
};
</script>
