import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginViewVue from "@/views/LoginView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/dashboard",
			name: "home",
			component: HomeView,
		},
		{
			path: "/dashboard/login",
			name: "login",
			component: LoginViewVue,
		},
	],
});

// router.beforeEach(async (to, from) => {
// 	const isAuthenticate = localStorage.getItem("token");
// 	if (!isAuthenticate) {
// 		return { name: "login" };
// 	}
// 	if (isAuthenticate && to.name === "login") {
// 		return { name: "postList" };
// 	}
// });

export default router;
