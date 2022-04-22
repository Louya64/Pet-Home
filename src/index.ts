import fastify from "fastify";
import fastifyJwt from "fastify-jwt";
import roleRouter from "./roles/routes";
import userRouter from "./users/routes";
import authRouter from "./auth/routes";
import categoryRouter from "./categories/routes";
import raceRouter from "./races/routes";
import offerStatusRouter from "./offer_status/routes";
import adoptionStatusRouter from "./adoption_status/routes";

const server = fastify();

server.register(fastifyJwt, {
	secret: "secret",
});

server.register(roleRouter, { prefix: "/roles" });
server.register(userRouter, { prefix: "/users" });
server.register(authRouter);
server.register(categoryRouter, { prefix: "/categories" });
server.register(raceRouter, { prefix: "/races" });
server.register(offerStatusRouter, { prefix: "/offerStatus" });
server.register(adoptionStatusRouter, { prefix: "/adoptionStatus" });

server.listen(8080, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
