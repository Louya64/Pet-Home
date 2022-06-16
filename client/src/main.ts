import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faCheck,
	faXmark,
	faAsterisk,
	faEye,
	faEyeSlash,
	faUser,
	faMessage,
	faCircle,
	faRightFromBracket,
	faChevronDown,
	faChevronUp,
	faChevronRight,
	faChevronLeft,
	faArrowDownLong,
	faArrowUpLong,
	faArrowRightLong,
	faMagnifyingGlass,
	faBars,
	faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
	faCheck,
	faXmark,
	faAsterisk,
	faEye,
	faEyeSlash,
	faUser,
	faMessage,
	faCircle,
	faRightFromBracket,
	faChevronDown,
	faChevronUp,
	faChevronRight,
	faChevronLeft,
	faArrowDownLong,
	faArrowUpLong,
	faArrowRightLong,
	faMagnifyingGlass,
	faBars,
	faCalendarDays
);

const app = createApp(App);

app.use(router);

app.component("font-awesome-icon", FontAwesomeIcon).mount("#app");
