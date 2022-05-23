import { FastifyInstance } from "fastify";
import { findUserByEmail, findUserByUsername } from "../users/dao";
import { UserType } from "../users/types";

// password regex
const checkPasswordFormat = (password: string) => {
	const regex = new RegExp(
		"^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@#$%^&(){}[:;<>,.?/~_+-=|])[0-9a-zA-Z*.!@#$%^&(){}[:;<>,.?/~_+-=|]{8,}$"
	);
	return regex.test(password);
};

// hash password
const hashPassword = async (server: FastifyInstance, password: string) => {
	return await server.bcrypt.hash(password);
};

// verify password
const verifyPassword = async (
	server: FastifyInstance,
	credentialPassword: string,
	hashedPassword: string
) => {
	return await server.bcrypt.compare(credentialPassword, hashedPassword);
};

// check confirmedPassword === password
const confirmPassword = (password: string, confirmedPassword: string) => {
	return password === confirmedPassword;
};

// check duplicateData
const duplicatedData = async (username: string, email: string) => {
	const usernameAlreadyExists = await findUserByUsername(username);
	const userEmailAlreadyExists = await findUserByEmail(email);

	if (userEmailAlreadyExists && usernameAlreadyExists) {
		return `Cet email et ce pseudonyme existent déjà`;
	} else if (userEmailAlreadyExists) {
		return `Cet email existe déjà`;
	} else if (usernameAlreadyExists) {
		return `Ce pseudonyme existe déjà`;
	} else return false;
};

//jwt -> create token
const createToken = (server: FastifyInstance, user: UserType) => {
	return server.jwt.sign({
		id: user.id,
		role: user.id_role,
	});
};

export {
	hashPassword,
	verifyPassword,
	createToken,
	checkPasswordFormat,
	confirmPassword,
	duplicatedData,
};
