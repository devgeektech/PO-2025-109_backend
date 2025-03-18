"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRequestNotification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sendRequestSchema = new mongoose_1.default.Schema({
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    propertyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Property",
        required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });
exports.sendRequestNotification = mongoose_1.default.model("sendRequest", sendRequestSchema);
//# sourceMappingURL=SendRequest.js.map