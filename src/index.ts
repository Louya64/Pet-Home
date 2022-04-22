import fastify from "fastify";
import roleRouter from "./roles/routes";
import categoryRouter from "./categories/routes";
import raceRouter from "./races/routes";
import offerStatusRouter from "./offerStatus/routes";
import adoptionStatusRouter from "./adoptionStatus/routes";
import offerRouter from "./offers/routes";
import adoptionRequestRouter from "./adoptionRequests/routes";

const server = fastify();

server.get("/test", (request, reply) => {
	reply.send("test ok");
});

server.register(roleRouter, { prefix: "/roles" });
server.register(categoryRouter, { prefix: "/categories" });
server.register(raceRouter, { prefix: "/races" });
server.register(offerStatusRouter, { prefix: "/offerStatus" });
server.register(adoptionStatusRouter, { prefix: "/adoptionStatus" });
server.register(offerRouter, { prefix: "/offers" });
server.register(adoptionRequestRouter, { prefix: "/adoptionRequests" });

server.listen(8080, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
