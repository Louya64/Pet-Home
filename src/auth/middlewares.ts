import {
	checkPasswordFormat,
	confirmPassword,
	duplicatedData,
} from "./helpers";
import { duplicateDataError, invalidDataError } from "../commons/errorHelpers";
import { UserCreateFromAppType } from "./types";
import { FastifyReply, FastifyRequest } from "fastify";

const userCreateValidateData = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const user: UserCreateFromAppType = request.body as UserCreateFromAppType;
	if (!checkPasswordFormat(user.password)) {
		reply
			.status(422)
			.send(
				invalidDataError(
					`Le mot de passe ne respecte pas le modèle(au moins 8 caractères dont 1 nombre, 1 minuscule, 1 majuscule, et 1 caractère spécial parmis *.!@#$%^&(){}[:;<>,.?/~_+-=|)`
				)
			);
	}
	if (!confirmPassword(user.password, user.confirmedPassword)) {
		reply
			.status(422)
			.send(
				invalidDataError(`Le mot de passe n'a pas été confirmé correctement`)
			);
	}
	const duplicateDataErrorMessage = await duplicatedData(
		user.username,
		user.email
	);
	if (duplicateDataErrorMessage) {
		reply.status(409).send(duplicateDataError(duplicateDataErrorMessage));
	}
};

export { userCreateValidateData };
