import { Server } from "socket.io";

interface IMessageData {
    _id: string;
    chatRoom: string;
    sender: string;
    receiver: string;
    message?: string;
    files?: string[];
}

const socketHandler = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("socket connected")
    socket.on("joinRoom", async (id) => {
        try {
            socket.join(id);
            console.log(`📌 User joined room: ${id}`);
        } catch (error) {
          console.error("❌ Error joining room:", error);
        }
      });

      // ✅ SEND MESSAGE
      socket.on("sendMessage", async (roomId:string,data: IMessageData) => {
        try {
          // Send message to room
          io.to(roomId).emit("receiveMessage", data);
          console.log(`📩 Message sent to room: ${roomId}`);
        } catch (error) {
          console.error("❌ Error sending message:", error);
        }
      });

      // ✅ DISCONNECT
      socket.on("disconnect", () => {
        console.log(`❌ User Disconnected: ${socket.id}`);
      });
  });
};

export default socketHandler;
