import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/public/HomeView.vue";
import LoginViewVue from "@/views/public/LoginView.vue";
import ForgotPasswordConfirmView from "../views/public/ForgotPasswordConfirmView.vue";
import ChangePasswordView from "../views/public/ChangePasswordView.vue";
import OffersView from "../views/public/OffersView.vue";
import ContactView from "../views/public/ContactView.vue";
import DashboardHome from "../views/dashboard/HomeView.vue";
import DashboardLogin from "../views/dashboard/LoginView.vue";
import DashboardForgotPassword from "../views/dashboard/ForgotPasswordConfirmView.vue";
import DashboardChangePassword from "../views/dashboard/ChangePasswordView.vue";
import jwt_decode from "jwt-decode";

interface ITokenDecoded {
	id: number;
	role: number;
	iat: number;
}

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
		///   DASHBOARD   ///
		{
			path: "/dashboard",
			name: "dashboard",
			component: DashboardHome,
		},
		{
			path: "/dashboard/login",
			name: "login",
			component: DashboardLogin,
		},
		{
			path: "/dashboard/forgotPasswordConfirm",
			name: "dashboardForgotPasswordConfirm",
			component: DashboardForgotPassword,
		},
		{
			path: "/dashboard/changePassword",
			name: "dashboardChangePassword",
			component: DashboardChangePassword,
		},
	],
});

router.beforeEach(async (to, from) => {
	const token = localStorage.getItem("token");
	console.log("token", token);

	let userRole = 0;
	if (token) {
		const tokenDecoded: ITokenDecoded = jwt_decode(token);
		userRole = tokenDecoded.role;
	}
	const isAdmin = userRole === 1 || userRole === 2;

	if (!isAdmin) {
		if (to.name === "dashboard") {
			return { name: "login" };
		}
	}

	// if (
	// 	!isAdmin &&
	// 	// liste des routes dispo sans être authentifié en tant qu'admin
	// 	to.name !== "login" &&
	// 	to.name !== "forgotPasswordConfirm" &&
	// 	to.name !== "changePassword" &&
	// 	to.name !== "facebookLoading"
	// ) {
	// 	return { name: "login" };
	// }
	// if (isAdmin && to.name === "login") {
	// 	return { name: "home" };
	// }
});

export default router;
