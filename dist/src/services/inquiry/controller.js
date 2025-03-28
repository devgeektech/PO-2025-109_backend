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
exports.deleteInquiry = exports.updateInquiry = exports.getAllInquiries = exports.getInquiryById = exports.createInquiry = void 0;
const http_errors_1 = require("../../utils/http-errors");
const response_util_1 = require("../../utils/response.util");
const messages_1 = require("../../constants/messages");
const Inquiry_1 = __importDefault(require("../../models/Inquiry"));
const createInquiry = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const inquiry = new Inquiry_1.default(payload);
        yield inquiry.save();
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: inquiry,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createInquiry = createInquiry;
const getInquiryById = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inquiryId = req.params.id;
        const inquiry = yield Inquiry_1.default.findById(inquiryId).exec();
        if (!inquiry) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.INQUIRY_ERRORS.INQUIRY_NOT_EXIST,
            }));
        }
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: inquiry,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getInquiryById = getInquiryById;
const getAllInquiries = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Aggregation pipeline
        const result = yield Inquiry_1.default.aggregate([
            { $match: searchQuery },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "properties", // The collection name for Property
                    localField: "property",
                    foreignField: "_id",
                    as: "propertyData",
                },
            },
            { $unwind: { path: "$propertyData", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    name: 1,
                    email: 1,
                    phone: 1,
                    query: 1,
                    isOnMarket: 1,
                    createdAt: 1,
                    property: { name: "$propertyData.name", _id: "$propertyData._id" }, // Project only needed fields
                }
            },
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
exports.getAllInquiries = getAllInquiries;
const updateInquiry = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const propertyId = req.params.id;
        const payload = req.body;
        const updatedProperty = yield Inquiry_1.default.findByIdAndUpdate(propertyId, payload, { new: true } // Return the updated document
        ).exec();
        if (!updatedProperty) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.INQUIRY_ERRORS.INQUIRY_NOT_EXIST,
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
exports.updateInquiry = updateInquiry;
const deleteInquiry = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const propertyId = req.params.id;
        const result = yield Inquiry_1.default.findByIdAndDelete(propertyId).exec();
        if (!result) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.INQUIRY_ERRORS.INQUIRY_NOT_EXIST,
            }));
        }
        return response_util_1.ResponseUtilities.sendResponsData({ code: 200, message: "Success" }); // Return true if deletion was successful
    }
    catch (error) {
        next(error);
    }
});
exports.deleteInquiry = deleteInquiry;
//# sourceMappingURL=controller.js.map