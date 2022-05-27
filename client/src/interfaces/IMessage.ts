export interface IMessageRes {
	id: number;
	creation_date: string;
	id_adoption_request: number;
	id_author: number | null;
	author: {
		username: string;
		lastname: string;
		firstname: string;
		id_role: number;
		role: {
			name: string;
		};
	};
	text: string;
}

export interface IMessageCreate {
	id_adoption_request: number;
	id_author: number | null;
	text: string;
}
