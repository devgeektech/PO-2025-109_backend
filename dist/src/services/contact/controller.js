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
exports.deleteContact = exports.updateContact = exports.getAllContacts = exports.getContactById = exports.createContact = void 0;
const http_errors_1 = require("../../utils/http-errors");
const response_util_1 = require("../../utils/response.util");
const messages_1 = require("../../constants/messages");
const Contact_1 = __importDefault(require("../../models/Contact"));
const createContact = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const contact = new Contact_1.default(payload);
        yield contact.save();
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: contact,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.createContact = createContact;
const getContactById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const propertyId = req.params.id;
        const property = yield Contact_1.default.findById(propertyId).exec();
        if (!property) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.CONTACT_ERRORS.CONTACT_NOT_EXIST,
            }));
        }
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: property,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getContactById = getContactById;
const getAllContacts = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchTerm = req.query.search || "";
        const skip = (page - 1) * limit;
        // Construct search filter
        const searchQuery = searchTerm
            ? { name: { $regex: searchTerm, $options: "i" } }
            : {};
        // Aggregate pipeline to get paginated results and total count
        const result = yield Contact_1.default.aggregate([
            { $match: searchQuery },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }], // Paginated data
                    totalCount: [{ $count: "count" }], // Total count
                },
            },
        ]);
        // Extract data and total count
        const properties = result[0].data;
        const totalRecords = ((_a = result[0].totalCount[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
        // Return response
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: properties,
            total: totalRecords,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllContacts = getAllContacts;
const updateContact = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const propertyId = req.params.id;
        const payload = req.body;
        const updatedProperty = yield Contact_1.default.findByIdAndUpdate(propertyId, payload, { new: true } // Return the updated document
        ).exec();
        if (!updatedProperty) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.CONTACT_ERRORS.CONTACT_NOT_EXIST,
            }));
        }
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: updatedProperty,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateContact = updateContact;
const deleteContact = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const propertyId = req.params.id;
        const result = yield Contact_1.default.findByIdAndDelete(propertyId).exec();
        if (!result) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.CONTACT_ERRORS.CONTACT_NOT_EXIST,
            }));
        }
        return response_util_1.ResponseUtilities.sendResponsData({ code: 200, message: "Success" }); // Return true if deletion was successful
    }
    catch (error) {
        next(error);
    }
});
exports.deleteContact = deleteContact;
//# sourceMappingURL=controller.js.map