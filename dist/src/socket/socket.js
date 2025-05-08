"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("socket connected");
        socket.on("joinRoom", (id) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                socket.join(id);
                console.log(`📌 User joined room: ${id}`);
            }
            catch (error) {
                console.error("❌ Error joining room:", error);
            }
        }));
        // ✅ SEND MESSAGE
        socket.on("sendMessage", (roomId, data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Send message to room
                io.to(roomId).emit("receiveMessage", data);
                console.log(`📩 Message sent to room: ${roomId}`);
            }
            catch (error) {
                console.error("❌ Error sending message:", error);
            }
        }));
        // ✅ DISCONNECT
        socket.on("disconnect", () => {
            console.log(`❌ User Disconnected: ${socket.id}`);
        });
    });
};
exports.default = socketHandler;
//# sourceMappingURL=socket.js.map