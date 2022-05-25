export interface IUser {
	email: string;
	password: string;
	confirmedPassword: string;
	username: string;
	firstname: string;
	lastname: string;
	phone_number: string;
}

export interface IUserRes {
	id: number;
	creation_date: string;
	role: {
		name: string;
	};
	id_role: number;
	email: string;
	username: string;
	firstname: string;
	lastname: string;
	phone_number: string;
}

export interface IUserCreateOrUpdate {
	id?: number;
	creation_date?: string;
	id_role?: number;
	email?: string;
	password?: string;
	lastPassword?: string;
	confirmedPassword?: string;
	username: string | null;
	firstname: string | null;
	lastname: string | null;
	phone_number: string | null;
}
