<template>
	<input
		class="form-item-input"
		:id="inputId"
		:type="inputType"
		:value="modelValue"
		@input="(e) => updateInput((e.target as HTMLInputElement).value)"
	/>
</template>

<script setup lang="ts">
interface Props {
	inputId: string;
	inputType: string;
	modelValue: string | number;
}
defineProps<Props>();
const emit = defineEmits<{
	(e: "update:modelValue", newValue: string | number): void;
}>();
const updateInput = (newValue: string) => {
	emit("update:modelValue", newValue);
};
</script>
