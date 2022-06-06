import { unauthorizedError } from "./errorHelpers";

const superAdminAccessOnly = async (request: any, reply: any) => {
	const user = await request.jwtVerify();
	if (user.role !== 1) {
		reply
			.status(401)
			.send(
				unauthorizedError(`Vous n'êtes pas authorisé à accéder à ces données`)
			);
	}
};

const adminAccessOnly = async (request: any, reply: any) => {
	const user = await request.jwtVerify();
	if (user.role !== 1 && user.role !== 2) {
		reply
			.status(401)
			.send(
				unauthorizedError(`Vous n'êtes pas authorisé à accéder à ces données`)
			);
	}
};

const ownerAccessOnly = async (request: any, reply: any) => {
	const user = await request.jwtVerify();
	if (user.id !== Number(request.params.id)) {
		reply
			.status(401)
			.send(
				unauthorizedError(`Vous n'êtes pas authorisé à accéder à ces données`)
			);
	}
};

const ownerOrAdminAccessOnly = async (request: any, reply: any) => {
	const user = await request.jwtVerify();
	if (
		user.id !== Number(request.params.id) &&
		user.role !== 1 &&
		user.role !== 2
	) {
		reply
			.status(401)
			.send(
				unauthorizedError(`Vous n'êtes pas authorisé à accéder à ces données`)
			);
	}
};

export {
	superAdminAccessOnly,
	adminAccessOnly,
	ownerAccessOnly,
	ownerOrAdminAccessOnly,
};
