import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginViewVue from "@/views/LoginView.vue";
import ForgotPasswordConfirmView from "../views/ForgotPasswordConfirmView.vue";
import ChangePasswordView from "../views/ChangePasswordView.vue";
import OffersView from "../views/OffersView.vue";
import ContactView from "../views/ContactView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/auth",
			name: "auth",
			component: LoginViewVue,
		},
		{
			path: "/forgotPasswordConfirm",
			name: "forgotPasswordConfirm",
			component: ForgotPasswordConfirmView,
		},
		{
			path: "/changePassword",
			name: "changePassword",
			component: ChangePasswordView,
		},
		{
			path: "/offers",
			name: "offers",
			component: OffersView,
		},
		{
			path: "/contact",
			name: "contact",
			component: ContactView,
		},
	],
});

export default router;
