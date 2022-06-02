export interface IAdoptionRequestRes {
	id: number;
	creation_date: string;
	id_offer: number;
	candidate_email: string;
	candidate_phone: string | null;
	id_candidate: number | null;
	status: {
		name: string;
	};
	id_adoption_status: number;
}

export interface IAdoptionRequestCreate {
	id_offer: number;
	candidate_email: string;
	candidate_phone: string | null;
	id_candidate: number | null;
	id_adoption_status: number;
}
