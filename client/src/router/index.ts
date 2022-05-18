// site
import HomeView from "../views/public/HomeView.vue";
import OffersView from "../views/public/OffersView.vue";
import ContactView from "../views/public/ContactView.vue";
import OfferDetails from "@/components/offers/OfferDetails.vue";

// commons
import LoginView from "@/views/commons/LoginView.vue";
import ForgotPasswordConfirmView from "@/views/commons/ForgotPasswordConfirmView.vue";
import ChangePasswordView from "@/views/commons/ChangePasswordView.vue";

// dashboard
import DashboardHome from "../views/dashboard/HomeView.vue";
import DashboardOffersList from "../views/dashboard/OffersListView.vue";
import DashboardOfferCreate from "@/views/dashboard/OfferCreateView.vue";
import DashboardOfferUpdate from "@/views/dashboard/OfferUpdateView.vue";
import DashboardCategories from "@/views/dashboard/CategoriesView.vue";
import DashboardRaces from "@/views/dashboard/RacesView.vue";
import DashboardUserRoles from "@/views/dashboard/UserRolesView.vue";

import { createRouter, createWebHistory } from "vue-router";
import jwt_decode from "jwt-decode";
import type { ITokenDecoded } from "../interfaces/ITokenDecoded";

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
			component: LoginView,
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
			props: (route) => ({
				query: [route.query.categoryId, route.query.categoryName],
			}),
		},
		{
			path: "/offers/:id",
			name: "offerDetails",
			component: OfferDetails,
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
			path: "/dashboard/offersList",
			name: "dashboardOffersList",
			component: DashboardOffersList,
		},
		{
			path: "/dashboard/offersList/:id",
			name: "dashboardOfferUpdate",
			component: DashboardOfferUpdate,
		},
		{
			path: "/dashboard/offerCreate",
			name: "dashboardOfferCreate",
			component: DashboardOfferCreate,
		},
		{
			path: "/dashboard/categories",
			name: "dashboardCategories",
			component: DashboardCategories,
		},
		{
			path: "/dashboard/races",
			name: "dashboardRaces",
			component: DashboardRaces,
		},
		{
			path: "/dashboard/userRoles",
			name: "dashboardUserRoles",
			component: DashboardUserRoles,
		},
	],
});

router.beforeEach(async (to, _from) => {
	const token = localStorage.getItem("token");
	let userRole = 0;
	if (token) {
		const tokenDecoded: ITokenDecoded = jwt_decode(token);
		userRole = tokenDecoded.role;
	}
	const isAdmin = userRole === 1 || userRole === 2;

	if (!isAdmin) {
		if (to.name?.toString().includes("dashboard")) {
			return { name: "auth" };
		}
	}
	if (isAdmin) {
		if (!to.name?.toString().includes("dashboard")) {
			return { name: "dashboard" };
		}
	}
});

export default router;
