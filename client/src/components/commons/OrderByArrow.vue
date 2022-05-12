<template>
	<div class="bg-brown-500">
		<font-awesome-icon
			@click="orderByAsc"
			icon="arrow-down-long"
			class="px-1 pt-1 hover:cursor-pointer hover:bg-yellow-700/50"
		/>
		<font-awesome-icon
			@click="orderByDesc"
			icon="arrow-up-long"
			class="px-1 pt-1 hover:cursor-pointer hover:bg-yellow-700/50"
		/>
	</div>
</template>

<script setup lang="ts">
interface Props {
	fieldName: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(e: "arrowClicked", order: string): void;
}>();

const orderByAsc = () => {
	emit("arrowClicked", props.fieldName + "-asc");
};
const orderByDesc = () => {
	emit("arrowClicked", props.fieldName + "-desc");
};
</script>
