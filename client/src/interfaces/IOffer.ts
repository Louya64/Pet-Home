export interface IOfferRes {
	id: number;
	creation_date: string;
	adoption_date: string | null;
	status: {
		name: string;
	};
	id_status: number;
	animal_name: string;
	age: number;
	category: {
		name: string;
	};
	id_category: number;
	race: {
		name: string;
	} | null;
	id_race: number | null;
	zipcode: number;
	city: string;
	identified: boolean;
	vaccinated: boolean;
	disabled: boolean;
	disability: string | null;
	description: string | null;
}
export interface IOfferCreate {
	animal_name: string | null;
	age: number;
	id_category: number;
	id_race: number | null;
	zipcode: number;
	city: string;
	identified: boolean;
	vaccinated: boolean;
	disabled: boolean;
	disability: string | null;
	description: string | null;
}
export interface IOfferUpdate {
	id: number;
	creation_date: string;
	adoption_date: string | null;
	id_status: number;
	animal_name: string | null;
	age: number;
	id_category: number;
	id_race: number | null;
	zipcode: number;
	city: string;
	identified: boolean;
	vaccinated: boolean;
	disabled: boolean;
	disability: string | null;
	description: string | null;
}
