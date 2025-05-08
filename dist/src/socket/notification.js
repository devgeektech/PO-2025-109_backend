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
exports.createNotification = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const server_1 = require("../server");
const createNotification = (userId_1, message_1, description_1, ...args_1) => __awaiter(void 0, [userId_1, message_1, description_1, ...args_1], void 0, function* (userId, message, description, type = 'property') {
    try {
        const newNotification = new Notification_1.default({
            user: userId,
            message: message,
            description: description, // Added description
            type: type,
        });
        server_1.io.to(userId).emit("receiveNotification", newNotification);
        yield newNotification.save();
        console.log('Notification created successfully!');
    }
    catch (error) {
        console.error('Error creating notification:', error);
    }
});
exports.createNotification = createNotification;
//# sourceMappingURL=notification.js.map