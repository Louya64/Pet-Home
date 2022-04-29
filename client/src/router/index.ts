import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/public/HomeView.vue";
import OffersView from "../views/public/OffersView.vue";
import ContactView from "../views/public/ContactView.vue";
import DashboardHome from "../views/dashboard/HomeView.vue";
import LoginViewVue from "@/views/commons/LoginView.vue";
import ForgotPasswordConfirmViewVue from "@/views/commons/ForgotPasswordConfirmView.vue";
import ChangePasswordViewVue from "@/views/commons/ChangePasswordView.vue";
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
			component: ForgotPasswordConfirmViewVue,
		},
		{
			path: "/changePassword",
			name: "changePassword",
			component: ChangePasswordViewVue,
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
	],
});

router.beforeEach(async (to, _from) => {
	const token = localStorage.getItem("token");
	console.log("token", token);

	let userRole = 0;
	if (token) {
		const tokenDecoded: ITokenDecoded = jwt_decode(token);
		userRole = tokenDecoded.role;
	}
	const isAdmin = userRole === 1 || userRole === 2;

	if (!isAdmin) {
		// lister les routes interdites sauf isAdmin
		if (to.name === "dashboard") {
			return { name: "auth" };
		}
	}

	// if (to.name === "auth") {
	// 	if (isAdmin) return { name: "dashboard" };
	// 	else if (token) return { name: "home" };
	// }
});

export default router;
