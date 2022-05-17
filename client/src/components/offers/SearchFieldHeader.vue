<template>
	<div
		class="flex justify-between hover:cursor-pointer hover:border-b hover:border-current"
		@click="() => $emit('activeSearch', !active)"
	>
		<h3>{{ title }}</h3>

		<!-- @click="() => $emit('activeSearch', true)" -->
		<label :for="fieldName"
			><font-awesome-icon
				class="mt-1 hover:cursor-pointer"
				icon="chevron-down"
				v-if="!active"
		/></label>

		<!-- @click="() => $emit('activeSearch', false)" -->
		<font-awesome-icon
			class="mt-1 hover:cursor-pointer"
			icon="chevron-up"
			v-if="active"
		/>
	</div>
	<div v-if="valueSelected" class="px-10">
		{{
			valueSelected.length > 10
				? valueSelected.slice(0, 10) + "..."
				: valueSelected
		}}
	</div>
</template>

<script setup lang="ts">
interface Props {
	title: string;
	fieldName: string;
	active: boolean;
	valueSelected: string;
}
defineProps<Props>();
defineEmits<{
	(e: "activeSearch", active: boolean): void;
}>();
</script>
