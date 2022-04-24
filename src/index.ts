import fastify from "fastify";
import fastifyJwt from "fastify-jwt";
import roleRouter from "./roles/routes";
import userRouter from "./users/routes";
import authRouter from "./auth/routes";

const server = fastify();

server.register(fastifyJwt, {
	secret: "secret",
});

server.register(roleRouter, { prefix: "/roles" });
server.register(userRouter, { prefix: "/users" });
server.register(authRouter);

server.listen(8080, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
