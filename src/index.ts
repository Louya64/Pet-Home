import fastify from "fastify";
import roleRouter from "./roles/routes";
import categoryRouter from "./categories/routes";
import raceRouter from "./races/routes";
import offerStatusRouter from "./offer_status/routes";
import adoptionStatusRouter from "./adoption_status/routes";

const server = fastify();

server.get("/test", (request, reply) => {
	reply.send("test ok");
});

server.register(roleRouter, { prefix: "/roles" });
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
