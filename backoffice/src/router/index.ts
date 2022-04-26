import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginViewVue from "@/views/LoginView.vue";
import ForgotPasswordConfirmView from "../views/ForgotPasswordConfirmView.vue";
import ChangePasswordView from "../views/ChangePasswordView.vue";

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
		{
			path: "/dashboard/forgotPasswordConfirm",
			name: "forgotPasswordConfirm",
			component: ForgotPasswordConfirmView,
		},
		{
			path: "/dashboard/changePassword",
			name: "changePassword",
			component: ChangePasswordView,
		},
	],
});

router.beforeEach(async (to, from) => {
	const isAuthenticate = localStorage.getItem("token");
	if (
		!isAuthenticate &&
		to.name !== "login" &&
		to.name !== "forgotPasswordConfirm" &&
		to.name !== "changePassword" &&
		to.name !== "facebookLoading"
	) {
		return { name: "login" };
	}
	if (isAuthenticate && to.name === "login") {
		return { name: "home" };
	}
});

export default router;
