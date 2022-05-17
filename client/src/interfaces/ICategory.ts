export interface ICategoryRes {
	id: number;
	name: string;
	id_parent_category: number | null;
}

export interface ICategoryCreate {
	name: string;
	id_parent_category: number | null;
}
