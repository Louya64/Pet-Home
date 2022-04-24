import { FastifyInstance } from "fastify";

// password regex
const checkPasswordFormat = (password: string) => {
	const regex = new RegExp(
		"^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@#$%^&(){}[:;<>,.?/~_+-=|])[0-9a-zA-Z!@#$%^&]{8,}$"
	);
	return regex.test(password);
};

// hash password
const hashPassword = async (server: FastifyInstance, password: string) => {
	return await server.bcrypt.hash(password);
};

//verify password
const verifyPassword = async (
	server: FastifyInstance,
	credentialPassword: string,
	hashedPassword: string
) => {
	return await server.bcrypt.compare(credentialPassword, hashedPassword);
};

//jwt -> create token
const createToken = (server: FastifyInstance, user: any) => {
	return server.jwt.sign({
		id: user.id,
		role: user.id_role,
	});
};

// jwt verify dans commons/accessMiddlewares ?

export { hashPassword, verifyPassword, createToken, checkPasswordFormat };
