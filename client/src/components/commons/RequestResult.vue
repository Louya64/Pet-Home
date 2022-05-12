<template>
	<div class="relative w-full h-20 text-center">
		<div
			:class="[success ? 'text-green-400' : 'text-red-400']"
			class="pb-10 text-center absolute w-full top-0"
		>
			{{ message }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
	resultMessage: string;
	success: boolean;
}
const props = defineProps<Props>();
const message = ref(props.resultMessage);

let timer = setTimeout(() => {
	message.value = "";
}, 5000);

watch(props, (newVal) => {
	if (newVal.resultMessage) {
		clearTimeout(timer);
		message.value = newVal.resultMessage;
		timer = setTimeout(() => {
			message.value = "";
		}, 5000);
	}
});
</script>
