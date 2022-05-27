<template>
	<div class="dashboardContainer">
		<h1>Créer un administrateur</h1>
		<UserForm :user="null" />
	</div>
</template>

<script setup lang="ts">
import UserForm from "@/components/users/UserForm.vue";
</script>
