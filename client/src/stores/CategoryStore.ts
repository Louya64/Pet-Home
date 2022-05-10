import { defineStore } from "pinia";

interface ICategory {
	id: number;
	name: string;
	id_parent_category: number | null;
}
export type CategoryRootState = {
	categorySelected: ICategory | null;
	resetFilters: boolean;
};

export const useCategoryStore = defineStore("categoryStore", {
	state: () => {
		return {
			categorySelected: null,
			resetFilters: false,
		} as CategoryRootState;
	},
});
