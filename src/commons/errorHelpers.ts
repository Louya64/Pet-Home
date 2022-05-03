const notFoundError = (message: string) => {
	return {
		statusCode: 404,
		error: "Not Found",
		message: message,
	};
};

const duplicateDataError = (message: string) => {
	return {
		statusCode: 409,
		error: "Conflict",
		message: message,
	};
};

const unauthorizedError = (message: string) => {
	return {
		statusCode: 401,
		error: "Unauthorized",
		message: message,
	};
};

const forbiddenError = (message: string) => {
	return {
		statusCode: 403,
		error: "Forbidden",
		message: message,
	};
};

const invalidDataError = (message: string) => {
	return {
		statusCode: 422,
		error: "Unprocessable Entity",
		message: message,
	};
};
//  forbidden 403, bad request 400

export {
	notFoundError,
	duplicateDataError,
	unauthorizedError,
	forbiddenError,
	invalidDataError,
};
