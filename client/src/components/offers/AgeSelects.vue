<template>
	<div class="flex justify-between">
		<div class="w-1/3 flex items-center">
			<select
				class="form-item-input flex-1 mx-1"
				id="ageYear"
				v-model="ageYear"
				@click="updateAge"
			>
				<option value="0">0</option>
				<option value="12">1</option>
				<option value="24">2</option>
				<option value="36">3</option>
				<option value="48">4</option>
				<option value="60">5</option>
				<option value="72">6</option>
				<option value="84">7</option>
				<option value="96">8</option>
				<option value="108">9</option>
				<option value="120">10</option>
				<option value="132">11</option>
				<option value="144">12</option>
				<option value="156">13</option>
				<option value="168">14</option>
				<option value="180">15</option>
				<option value="192">16</option>
				<option value="204">17</option>
				<option value="216">18</option>
				<option value="228">19</option>
				<option value="240">20</option>
			</select>
			<label for="ageYear"> ans</label>
		</div>
		<div class="w-1/3 flex items-center">
			<select
				class="form-item-input flex-1 mx-1"
				id="ageMonth"
				v-model="ageMonth"
				@click="updateAge"
			>
				<option value="0">0</option>
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option value="5">5</option>
				<option value="6">6</option>
				<option value="7">7</option>
				<option value="8">8</option>
				<option value="9">9</option>
				<option value="10">10</option>
				<option value="11">11</option>
			</select>
			<label for="ageMonth" class="block"> mois</label>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
	(e: "setAge", age: number): void;
}>();

interface Props {
	age: number;
}

const props = defineProps<Props>();

const ageMonth = ref(0);
const ageYear = ref(0);

if (props.age !== 0) {
	ageYear.value = Math.floor(props.age / 12) * 12;
	ageMonth.value = props.age - ageYear.value;
}

const updateAge = () => {
	emit("setAge", Number(ageMonth.value) + Number(ageYear.value));
};
</script>
