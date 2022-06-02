import { FastifyInstance } from "fastify";
import { SocketMessageType } from "../messages/types";

export default {
	start: function (io: FastifyInstance["io"]) {
		io.on("connection", function (socket: any) {
			socket.on("joinRoom", (room: string) => {
				if (socket.data.roomJoined) {
					socket.leave(socket.data.roomJoined);
				}
				socket.join(room);
				socket.data.roomJoined = room;
			});

			socket.on("leave", () => {
				if (socket.data.roomJoined) {
					socket.leave(socket.data.roomJoined);
					socket.data.roomJoined = "";
				}
			});

			socket.on("newMessage", (message: SocketMessageType, room: string) => {
				const newMessage = { ...message, creation_date: new Date() };
				io.to(room).emit("updateMessages", newMessage);
			});
		});
	},
};
