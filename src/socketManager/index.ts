import { FastifyInstance } from "fastify";

export default {
	start: function (io: FastifyInstance["io"]) {
		io.on("connection", function (socket: any) {
			io.emit("confirmConnection", "connection ok");

			socket.on("message de l'admin", (message: any) => {
				console.log(message);
				io.to(socket.id).emit("message du back", "reçu mess admin");
			});

			socket.on("message du site", (message: any) => {
				console.log(message);
				io.to(socket.id).emit("message du back", "reçu mess user");
			});
		});
	},
};
