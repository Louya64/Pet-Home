<template>
	<div class="border w-fit flex items-center px-2 m-1">
		<div class="pr-2">
			{{
				selectedValue.length > 10
					? selectedValue.slice(0, 10) + "..."
					: selectedValue
			}}
		</div>
		<font-awesome-icon
			title="Retirer le filtre"
			@click="
				() => {
					$emit('resetFilter');
				}
			"
			class="hover:cursor-pointer"
			icon="xmark"
		/>
	</div>
</template>

<script setup lang="ts">
interface Props {
	selectedValue: string;
}
defineProps<Props>();
defineEmits<{
	(e: "resetFilter"): void;
}>();
</script>
