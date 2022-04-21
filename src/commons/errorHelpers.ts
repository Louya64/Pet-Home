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

// const invalidData = { erreurs de longueur, de type etc ...
// 	statusCode: 422,
// 	error: "Unprocessable Entity",
// 	message: `à personnaliser`,
// }
// unauthorized 401, forbidden 403, bad request 400

export { notFoundError, duplicateDataError };
