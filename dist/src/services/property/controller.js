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
exports.deletePropertyImage = exports.deleteProperty = exports.updateProperty = exports.getRelatedProperties = exports.getAllProperties = exports.getPropertyById = exports.createProperty = void 0;
const http_errors_1 = require("../../utils/http-errors");
const response_util_1 = require("../../utils/response.util");
const messages_1 = require("../../constants/messages");
const Property_1 = __importDefault(require("../../models/Property"));
const fs_1 = require("fs");
const createProperty = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const payload = req.body;
        const property = new Property_1.default(payload);
        if (req.files && req.files.length) {
            let filesData = req.files;
            for (const file of filesData) {
                const mType = file === null || file === void 0 ? void 0 : file.mimetype.split('/')[0];
                if (mType == 'image') {
                    (_a = property.images) === null || _a === void 0 ? void 0 : _a.push(file === null || file === void 0 ? void 0 : file.filename);
                }
                else {
                    (_b = property.videos) === null || _b === void 0 ? void 0 : _b.push(file === null || file === void 0 ? void 0 : file.filename);
                }
            }
        }
        yield property.save();
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: property,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.createProperty = createProperty;
const getPropertyById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const propertyId = req.params.id;
        const property = yield Property_1.default.findById(propertyId).exec();
        if (!property) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.PROPERTY_ERRORS.PROPERTY_NOT_EXIST,
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
exports.getPropertyById = getPropertyById;
const getAllProperties = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchTerm = req.query.search || "";
        const propertyType = req.query.propertyType || "";
        const buildings = parseInt(req.query.buildings) || 0;
        const floors = parseInt(req.query.floors) || 0;
        const metering = req.query.metering || "";
        const startLandArea = parseInt(req.query.startLandArea) || 0;
        const endLandArea = parseInt(req.query.endLandArea) || 0;
        const skip = (page - 1) * limit;
        // Construct the search filter
        const searchQuery = { isDeleted: false };
        if (searchTerm) {
            searchQuery.name = { $regex: searchTerm, $options: "i" };
        }
        if (propertyType) {
            searchQuery.propertyType = propertyType;
        }
        if (buildings > 0) {
            searchQuery.buildings = { $gte: buildings };
        }
        if (metering) {
            searchQuery.metering = metering;
        }
        if (floors > 0) {
            searchQuery.floors = { $gte: floors };
        }
        if (startLandArea > 0 || endLandArea > 0) {
            searchQuery.landArea = {};
            if (startLandArea > 0) {
                searchQuery.landArea.$gte = startLandArea;
            }
            if (endLandArea > 0) {
                searchQuery.landArea.$lte = endLandArea;
            }
        }
        // Aggregation pipeline
        const result = yield Property_1.default.aggregate([
            { $match: searchQuery },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }], // Paginated properties
                    totalCount: [{ $count: "count" }], // Total count
                },
            },
        ]);
        // Extract paginated data and total count
        const properties = result[0].data;
        const totalRecords = ((_a = result[0].totalCount[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
        // Return response
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: properties,
            total: totalRecords
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllProperties = getAllProperties;
const getRelatedProperties = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = parseInt(req.query.limit) || 6;
        const propertyId = req.query.current;
        // Fetch the current property
        const currentProperty = yield Property_1.default.findById(propertyId);
        if (!currentProperty) {
            return response_util_1.ResponseUtilities.sendResponsData({
                code: 404,
                message: "Property not found",
                data: [],
            });
        }
        // Construct search filter for related properties
        const searchQuery = {
            _id: { $ne: propertyId }, // Exclude the current property
            isDeleted: false, // Only fetch active properties
            propertyType: currentProperty.propertyType, // Match property type
        };
        // Optionally match by subType if it exists
        if (currentProperty.subType) {
            searchQuery.subType = currentProperty.subType;
        }
        // Optionally match by investment type
        if (currentProperty.investmentType) {
            searchQuery.investmentType = currentProperty.investmentType;
        }
        // Fetch related properties
        const relatedProperties = yield Property_1.default.find(searchQuery)
            .sort({ createdAt: -1 }) // Get the latest properties
            .limit(limit);
        // Return response
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: relatedProperties,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getRelatedProperties = getRelatedProperties;
const updateProperty = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const propertyId = req.params.id;
        let payload = req.body;
        // Fetch existing property to preserve old media
        const existingProperty = yield Property_1.default.findById(propertyId).exec();
        if (!existingProperty) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.PROPERTY_ERRORS.PROPERTY_NOT_EXIST,
            }));
        }
        // Initialize arrays if not present in payload
        payload.images = existingProperty.images || [];
        payload.videos = existingProperty.videos || [];
        if (req.files && req.files.length) {
            let filesData = req.files;
            for (const file of filesData) {
                const mType = file === null || file === void 0 ? void 0 : file.mimetype.split('/')[0];
                if (mType == 'image') {
                    (_a = payload.images) === null || _a === void 0 ? void 0 : _a.push(file === null || file === void 0 ? void 0 : file.filename);
                }
                else {
                    (_b = payload.videos) === null || _b === void 0 ? void 0 : _b.push(file === null || file === void 0 ? void 0 : file.filename);
                }
            }
        }
        console.log(payload);
        const updatedProperty = yield Property_1.default.findOneAndUpdate({ _id: propertyId }, { $set: payload }, { new: true } // Return the updated document
        ).exec();
        if (!updatedProperty) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.PROPERTY_ERRORS.PROPERTY_NOT_EXIST,
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
exports.updateProperty = updateProperty;
const deleteProperty = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const propertyId = req.params.id;
        const result = yield Property_1.default.findOneAndUpdate({ _id: propertyId }, { isDeleted: true }).exec();
        if (!result) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.PROPERTY_ERRORS.PROPERTY_NOT_EXIST,
            }));
        }
        return response_util_1.ResponseUtilities.sendResponsData({ code: 200, message: "Success" }); // Return true if deletion was successful
    }
    catch (error) {
        next(error);
    }
});
exports.deleteProperty = deleteProperty;
const deletePropertyImage = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const propertyId = req.params.id;
        const result = yield Property_1.default.findOneAndUpdate({ _id: propertyId }, {
            $pull: {
                images: req.body.filename,
                videos: req.body.filename
            }
        }).exec();
        (0, fs_1.unlink)("./public/uploads/" + ((_a = req.body) === null || _a === void 0 ? void 0 : _a.filename), (error) => {
            if (error) {
                console.log(`File delete error: ${error.message}`);
            }
        });
        if (!result) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.PROPERTY_ERRORS.PROPERTY_NOT_EXIST,
            }));
        }
        return response_util_1.ResponseUtilities.sendResponsData({ code: 200, message: "Success" }); // Return true if deletion was successful
    }
    catch (error) {
        next(error);
    }
});
exports.deletePropertyImage = deletePropertyImage;
//# sourceMappingURL=controller.js.map