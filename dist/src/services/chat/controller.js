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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRequest = exports.deleteChatRoom = exports.updateStatus = exports.getChatRoomStatus = exports.updateChatRoom = exports.getChatRoomsByUser = exports.getAllChatMessages = exports.getAllChats = exports.getChatRoomById = exports.sendChatMessage = exports.createChatRoom = void 0;
const Chat_1 = __importDefault(require("../../models/Chat"));
const http_errors_1 = require("../../utils/http-errors");
const response_util_1 = require("../../utils/response.util");
const messages_1 = require("../../constants/messages");
const Message_1 = __importDefault(require("../../models/Message"));
const mongoose_1 = __importDefault(require("mongoose"));
const notification_1 = require("../../socket/notification");
const notification_2 = require("../../utils/notification");
const notification_3 = require("../../constants/notification");
const Users_1 = __importDefault(require("../../models/Users"));
const Property_1 = __importDefault(require("../../models/Property"));
const server_1 = require("../../server");
const SendRequest_1 = require("../../models/SendRequest");
const createChatRoom = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { participants, propertyId } = req.body;
        if (!propertyId) {
            return res.status(400).json({
                code: 400,
                message: "Property ID is required.",
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(propertyId)) {
            return res.status(400).json({
                code: 400,
                message: "Invalid Property ID.",
            });
        }
        let chatRoom = yield Chat_1.default.findById(propertyId);
        if (!chatRoom) {
            chatRoom = new Chat_1.default({
                _id: propertyId,
                participants,
            });
            yield chatRoom.save();
        }
    }
    catch (error) {
        next(error);
    }
});
exports.createChatRoom = createChatRoom;
const sendChatMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const chatRoomId = req.params.id;
        const { message, sender, receiver } = req.body;
        const chatRoom = yield Chat_1.default.findById(chatRoomId).exec();
        if (!chatRoom) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.CHAT_ERRORS.CHAT_NOT_EXIST,
            }));
        }
        let result = new Message_1.default({
            message,
            sender,
            receiver,
            chatRoom: chatRoomId,
        });
        if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.length) {
            let filesData = req.files;
            console.log(filesData);
            filesData = filesData.map((file) => file.filename);
            result.files = filesData;
        }
        yield (0, notification_1.createNotification)(receiver, "Send you a message", message, "chat");
        result = yield result.save();
        result = yield result.populate("sender receiver");
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.sendChatMessage = sendChatMessage;
const getChatRoomById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatRoomId = req.params.id;
        const chatRoom = yield Chat_1.default.findById(chatRoomId)
            .populate("participants") // Optional: to populate participant details
            .exec();
        if (!chatRoom) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.CHAT_ERRORS.CHAT_NOT_EXIST,
            }));
        }
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: chatRoom,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getChatRoomById = getChatRoomById;
const getAllChats = (next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatRooms = yield Chat_1.default.find({
            isDeleted: false,
        })
            .populate("participants") // Optional: to populate participant details
            .exec();
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: chatRooms,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllChats = getAllChats;
// export const getAllChatMessages = async (req: Request, next: NextFunction) => {
//   try {
//     const { sender, receiver } = req.query;
//     if (!sender || !receiver) {
//       throw new HTTP400Error(
//         ResponseUtilities.sendResponsData({
//           code: 400,
//           message: MESSAGES.CHAT_ERRORS.SENDER_AND_RECEIVER_ARE_REQUIRED,
//         })
//       );
//     }
//     const participants = [sender, receiver].map(
//       (id: any) => new mongoose.Types.ObjectId(id)
//     );
//     let chatRoom = await ChatRoom.findOne({
//       participants: { $all: participants },
//     })
//       .populate("participants")
//       .select("status participants")
//       .exec();
//     if (!chatRoom) {
//       chatRoom = await new ChatRoom({
//         participants: [sender, receiver],
//         createdBy: sender,
//       }).save();
//       chatRoom = await chatRoom.populate("participants");
//       await createNotification(
//         receiver,
//         NOTIFICATON_MSG.YOU_HAVE_INVITED_IN_CHAT.message,
//         NOTIFICATON_MSG.YOU_HAVE_INVITED_IN_CHAT.description,
//         "chat"
//       );
//       const receiverData = await Users.findById(receiver);
//       await pushNotification(
//         receiverData?.deviceToken,
//         {
//           title: NOTIFICATON_MSG.YOU_HAVE_INVITED_IN_CHAT.message,
//           message: NOTIFICATON_MSG.YOU_HAVE_INVITED_IN_CHAT.description,
//         },
//         sender
//       );
//       return ResponseUtilities.sendResponsData({
//         code: 200,
//         message: "Success",
//         data: {
//           room: chatRoom,
//           messages: [],
//         },
//       });
//     } else {
//       const messages = await Message.find({
//         chatRoom: chatRoom?._id,
//         isDeleted: false,
//       })
//         .populate("sender")
//         .populate("receiver");
//       return ResponseUtilities.sendResponsData({
//         code: 200,
//         message: "Success",
//         data: {
//           room: chatRoom,
//           messages,
//         },
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };
const getAllChatMessages = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sender, receiver } = req.query;
        if (!sender || !receiver) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.CHAT_ERRORS.SENDER_AND_RECEIVER_ARE_REQUIRED,
            }));
        }
        const participants = [sender, receiver].map((id) => new mongoose_1.default.Types.ObjectId(id));
        let chatRoom = yield Chat_1.default.findOne({
            participants: { $all: participants },
        })
            .populate("participants")
            .select("status participants")
            .exec();
        if (!chatRoom) {
            chatRoom = yield new Chat_1.default({
                participants: [sender, receiver],
                createdBy: sender,
                status: "pending", // Default status
            }).save();
            chatRoom = yield chatRoom.populate("participants");
            yield (0, notification_1.createNotification)(receiver, notification_3.NOTIFICATON_MSG.YOU_HAVE_INVITED_IN_CHAT.message, notification_3.NOTIFICATON_MSG.YOU_HAVE_INVITED_IN_CHAT.description, "chat");
            const receiverData = yield Users_1.default.findById(receiver);
            yield (0, notification_2.pushNotification)(receiverData === null || receiverData === void 0 ? void 0 : receiverData.deviceToken, {
                title: notification_3.NOTIFICATON_MSG.YOU_HAVE_INVITED_IN_CHAT.message,
                message: notification_3.NOTIFICATON_MSG.YOU_HAVE_INVITED_IN_CHAT.description,
            }, sender);
            return response_util_1.ResponseUtilities.sendResponsData({
                code: 200,
                message: "Success",
                data: {
                    room: chatRoom,
                    messages: [],
                },
            });
        }
        else {
            const messages = yield Message_1.default.find({
                chatRoom: chatRoom === null || chatRoom === void 0 ? void 0 : chatRoom._id,
                isDeleted: false,
            })
                .populate("sender")
                .populate("receiver");
            return response_util_1.ResponseUtilities.sendResponsData({
                code: 200,
                message: "Success",
                data: {
                    room: chatRoom.toObject(),
                    status: chatRoom.status,
                    messages: messages.map((msg) => msg.toObject()),
                },
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getAllChatMessages = getAllChatMessages;
const getChatRoomsByUser = (userId, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatRooms = yield Chat_1.default.find({
            participants: userId,
            isDeleted: false,
        })
            .populate("participants") // Optional: to populate participant details
            .exec();
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: chatRooms,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getChatRoomsByUser = getChatRoomsByUser;
const updateChatRoom = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatRoomId = req.params.id;
        const { participants } = req.body;
        const updatedChatRoom = yield Chat_1.default.findByIdAndUpdate(chatRoomId, { participants }, { new: true } // Return the updated document
        ).exec();
        if (!updatedChatRoom) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.CHAT_ERRORS.CHAT_NOT_EXIST,
            }));
        }
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: exports.updateChatRoom,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateChatRoom = updateChatRoom;
const getChatRoomStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatRoomId = req.params.room;
        const chatStatus = yield Chat_1.default.findById(chatRoomId)
            .populate("status")
            .exec();
        if (!chatStatus) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.CHAT_ERRORS.CHAT_NOT_EXIST,
            }));
        }
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: chatStatus,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getChatRoomStatus = getChatRoomStatus;
const updateStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const propertyId = req.params.room;
        const { status } = req.body;
        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({
                code: 400,
                message: "Invalid status. Only 'accepted' or 'rejected' are allowed.",
            });
        }
        // Ensure propertyId is a valid ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(propertyId)) {
            return res.status(400).json({
                code: 400,
                message: "Invalid Property ID format.",
            });
        }
        // Find chat room before updating
        let chatRoom = yield Chat_1.default.findById(propertyId);
        if (!chatRoom) {
            return res.status(404).json({
                code: 404,
                message: "Chat room not found.",
            });
        }
        // Update chat room status
        chatRoom.status = status;
        yield chatRoom.save();
        // Update property status based on propertyId
        const updatedProperty = yield Property_1.default.findByIdAndUpdate(propertyId, { status }, { new: true });
        if (!updatedProperty) {
            console.warn(`Property with ID ${propertyId} not found.`);
        }
        return res.status(200).json({
            code: 200,
            message: `Status updated to '${status}' successfully.`,
            data: {
                chatRoom: chatRoom.toObject(),
                property: (updatedProperty === null || updatedProperty === void 0 ? void 0 : updatedProperty.toObject()) || null,
            },
        });
    }
    catch (error) {
        console.error("Error updating status:", error);
        next(error);
    }
});
exports.updateStatus = updateStatus;
const deleteChatRoom = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatRoomId = req.params.id;
        const result = yield Chat_1.default.findOneAndUpdate({ _id: chatRoomId }, { isDeleted: true }).exec();
        if (!result) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.CHAT_ERRORS.CHAT_NOT_EXIST,
            }));
        }
        return response_util_1.ResponseUtilities.sendResponsData({ code: 200, message: "Success" }); // Return true if deletion was successful
    }
    catch (error) {
        next(error);
    }
});
exports.deleteChatRoom = deleteChatRoom;
const sendRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderId, receiverId, propertyId } = req.body;
        const chatRoomId = propertyId;
        if (!mongoose_1.default.Types.ObjectId.isValid(senderId) ||
            !mongoose_1.default.Types.ObjectId.isValid(receiverId) ||
            !mongoose_1.default.Types.ObjectId.isValid(propertyId)) {
            return res.status(400).json({ message: "Invalid IDs provided" });
        }
        let chatRoom = yield Chat_1.default.findById(chatRoomId);
        if (!chatRoom) {
            chatRoom = new Chat_1.default({
                _id: chatRoomId,
                participants: [senderId, receiverId],
                status: "pending",
                createdBy: senderId,
            });
            yield chatRoom.save();
        }
        else {
            chatRoom.status = "pending";
            chatRoom.participants = [senderId, receiverId];
            yield chatRoom.save();
        }
        const property = yield Property_1.default.findByIdAndUpdate(chatRoomId, { status: "pending" }, { new: true });
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        // const receiver = await Users.findById(receiverId);
        // if (!receiver || !deviceToken) {
        //   return res.status(404).json({ message: "Receiver not found or device token missing" });
        // }
        // const notificationData = {
        //   title: "New Request Received",
        //   message: "You have a new request for a property!",
        // };
        // pushNotification(deviceToken, notificationData, (err: any, resp: any) => {
        //   if (err) {
        //     console.error("Error sending push notification:", err);
        //   } else {
        //     console.log("Push notification sent successfully:", resp);
        //   }
        // });
        const notification = new SendRequest_1.sendRequestNotification({
            senderId,
            receiverId,
            propertyId,
            message: `You have a new chat request for property ${propertyId}.`,
        });
        yield notification.save();
        server_1.io.to(receiverId.toString()).emit("newNotification", notification);
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Request sent successfully",
            data: chatRoom,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.sendRequest = sendRequest;
//# sourceMappingURL=controller.js.map