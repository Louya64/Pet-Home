import fastify from "fastify";
import roleRouter from "./roles/routes";
import userRouter from "./users/routes";

const server = fastify();

server.register(roleRouter, { prefix: "/roles" });
server.register(userRouter, { prefix: "/users" });

server.listen(8080, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
