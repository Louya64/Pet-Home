<template>
	<form action="" class="form">
		<div class="form-item">
			<label for="animal_name">Nom de l'animal</label>
			<input
				class="form-item-input"
				type="text"
				id="animal_name"
				v-model="animal_name"
			/>
		</div>
		<div class="form-item">
			<label for="age">Age (en mois)</label>
			<input class="form-item-input" type="number" id="age" v-model="age" />
		</div>
		<div class="form-item" v-if="categoriesList">
			<label for="category"></label>
			<select id="category" v-model="id_category">
				<option value="0">Sélectionnez une catégorie</option>
				<option v-for="categorie in categoriesList" :value="categorie.id">
					{{ categorie.name }}
				</option>
			</select>
		</div>

		<!-- parent catégorie -->

		<div class="form-item">
			<label for="race"></label>
			<select id="race" v-model="id_race">
				<option value="0">Sélectionnez une race</option>
				<option v-for="race in racesList" :value="race.id">
					{{ race.name }}
				</option>
			</select>
		</div>
		<div class="form-item">
			<label for="zipcode">Code postal</label>
			<input
				class="form-item-input"
				type="number"
				id="zipcode"
				v-model="zipcode"
			/>
		</div>
		<div class="form-item">
			<label for="city">Ville</label>
			<input class="form-item-input" type="text" id="city" v-model="city" />
		</div>

		<div class="form-item">
			<Switch
				v-model:checked="identified"
				:label="identified ? ' identifié' : ' non identifié'"
				@switchChange="(checked) => (identified = checked)"
			/>
		</div>
		<div class="form-item">
			<Switch
				v-model:checked="vaccinated"
				:label="vaccinated ? ' vacciné' : ' non vacciné'"
				@switchChange="(checked) => (vaccinated = checked)"
			/>
		</div>
		<div class="form-item">
			<Switch
				v-model:checked="disabled"
				:label="disabled ? ' handicapé' : ' pas de handicap'"
				@switchChange="(checked) => (disabled = checked)"
			/>
		</div>

		<div v-if="disabled" class="form-item">
			<label for="disability">Nommer ou décrire rapidement le handicap</label>
			<input
				class="form-item-input"
				type="text"
				id="disability"
				v-model="disability"
			/>
		</div>
		<div class="form-item">
			<label for="description">Description</label>
			<textarea
				name="description"
				id="description"
				cols="30"
				rows="10"
			></textarea>
		</div>
		<div class="form-item">
			<label for="photos">Ajouter des photos</label>
			<input class="form-item-input" type="file" id="photos" />
		</div>
		<div class="flex justify-end">
			<button class="btn btn-green">Enregistrer</button>
		</div>
	</form>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from "vue";
import axios from "axios";
import Switch from "./Switch.vue";

interface ICategory {
	id: number;
	name: string;
	id_parent_category: number | null;
}
interface IRace {
	id: number;
	name: string;
	id_category: number;
}
let categoriesList: Ref<ICategory[]> = ref([]);
let racesList: Ref<IRace[]> = ref([]);
const animal_name = ref("");
const age = ref(0);
const id_category = ref(0);
const id_race = ref(0);
const zipcode = ref(0);
const city = ref("");
const identified = ref(false);
const vaccinated = ref(false);
const disabled = ref(false);
const disability = ref("");

onMounted(() => {
	axios.get(`${import.meta.env.VITE_URL_BACK}/categories`).then((res) => {
		categoriesList.value = res.data;
	});

	axios.get(`${import.meta.env.VITE_URL_BACK}/races`).then((res) => {
		racesList.value = res.data;
	});
});

watch(id_category, (newVal) => {
	console.log(newVal);
	console.log(categoriesList.value);

	if (newVal) {
		axios
			.get(`${import.meta.env.VITE_URL_BACK}/races?id_category=${newVal}`)
			.then((res) => {
				racesList.value = res.data;
			});
	}
});
</script>
