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
exports.deleteNotification = exports.updateNotification = exports.getAllNotificationsByUser = exports.getAllNotifications = exports.getNotificationById = exports.createBroadcastMessage = void 0;
const http_errors_1 = require("../../utils/http-errors");
const response_util_1 = require("../../utils/response.util");
const messages_1 = require("../../constants/messages");
const Notification_1 = __importDefault(require("../../models/Notification"));
const createBroadcastMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const notification = new Notification_1.default(payload);
        yield notification.save();
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: notification,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.createBroadcastMessage = createBroadcastMessage;
const getNotificationById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notificationId = req.params.id;
        const notification = yield Notification_1.default.findById(notificationId).exec();
        if (!notification) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.NOTIFICATION_ERRORS.NOTIFICATION_NOT_EXIST,
            }));
        }
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: notification,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getNotificationById = getNotificationById;
const getAllNotifications = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchTerm = req.query.search || "";
        // Initialize the searchQuery object
        let searchQuery = {
            $or: [],
        };
        // Add search term filter if provided
        if (searchTerm) {
            searchQuery.$or.push({ title: { $regex: searchTerm, $options: 'i' } });
        }
        // If no search term or other filters exist, remove $or from searchQuery
        if (!((_a = searchQuery.$or) === null || _a === void 0 ? void 0 : _a.length)) {
            delete searchQuery.$or;
        }
        // Pagination settings
        const skip = (page - 1) * limit;
        // Fetch notifications based on the searchQuery
        const notifications = yield Notification_1.default.find(searchQuery).sort({ isRead: -1 })
            .skip(skip)
            .limit(limit);
        // Get total record count for pagination
        const totalRecords = yield Notification_1.default.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalRecords / limit);
        // Return response with pagination data
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: notifications,
            pagination: {
                totalPages,
                currentPage: page,
                limit,
                totalRecords,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllNotifications = getAllNotifications;
const getAllNotificationsByUser = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const user = req.params.id || "";
        // Initialize the searchQuery object
        let searchQuery = {
            user
        };
        // Pagination settings
        const skip = (page - 1) * limit;
        // Fetch notifications based on the searchQuery
        const notifications = yield Notification_1.default.find(searchQuery).sort({ isRead: -1 })
            .skip(skip)
            .limit(limit);
        // Get total record count for pagination
        const totalRecords = yield Notification_1.default.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalRecords / limit);
        // Return response with pagination data
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: notifications,
            pagination: {
                totalPages,
                currentPage: page,
                limit,
                totalRecords,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllNotificationsByUser = getAllNotificationsByUser;
const updateNotification = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const propertyId = req.params.id;
        const payload = req.body;
        const updatedNotification = yield Notification_1.default.findByIdAndUpdate(propertyId, payload, { new: true } // Return the updated document
        ).exec();
        if (!updatedNotification) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.NOTIFICATION_ERRORS.NOTIFICATION_NOT_EXIST,
            }));
        }
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: updatedNotification,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateNotification = updateNotification;
const deleteNotification = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const propertyId = req.params.id;
        const result = yield Notification_1.default.findOneAndUpdate({ _id: propertyId }, { isDeleted: true }).exec();
        if (!result) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.NOTIFICATION_ERRORS.NOTIFICATION_NOT_EXIST,
            }));
        }
        return response_util_1.ResponseUtilities.sendResponsData({ code: 200, message: "Success" }); // Return true if deletion was successful
    }
    catch (error) {
        next(error);
    }
});
exports.deleteNotification = deleteNotification;
//# sourceMappingURL=controller.js.map