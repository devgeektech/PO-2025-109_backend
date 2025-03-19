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
exports.deletePropertyImage = exports.deleteProperty = exports.updateProperty = exports.getAllProperties = exports.getPropertyById = exports.createProperty = void 0;
const http_errors_1 = require("../../utils/http-errors");
const response_util_1 = require("../../utils/response.util");
const messages_1 = require("../../constants/messages");
const Property_1 = __importDefault(require("../../models/Property"));
const fs_1 = require("fs");
const createProperty = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const payload = req.body;
        const property = new Property_1.default(payload);
        console.log(req.files);
        if (req.files && req.files.length) {
            let filesData = req.files;
            filesData = filesData.map((file) => file.filename);
            property.images = filesData;
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
        const buildingStatus = req.query.buildingStatus || "";
        const buildings = parseInt(req.query.buildings) || 0;
        const units = parseInt(req.query.units) || 0;
        const floors = parseInt(req.query.floors) || 0;
        const startLandArea = parseInt(req.query.startLandArea) || 0;
        const endLandArea = parseInt(req.query.endLandArea) || 0;
        // Initialize the searchQuery object
        let searchQuery = {
            isDeleted: false,
            $or: [],
        };
        // Add search term filter if provided
        if (searchTerm) {
            searchQuery.$or.push({ name: { $regex: searchTerm, $options: 'i' } });
        }
        // Add propertyType filter if provided
        if (buildingStatus) {
            searchQuery.buildingStatus = buildingStatus;
        }
        // Add bedrooms filter if provided
        if (buildings > 0) {
            searchQuery.buildings = buildings;
        }
        // Add bathrooms filter if provided
        if (units > 0) {
            searchQuery.units = units;
        }
        if (floors > 0) {
            searchQuery.floors = floors;
        }
        // Add area range filter if provided
        if (startLandArea > 0 || endLandArea > 0) {
            searchQuery.landArea = {};
            if (startLandArea > 0) {
                searchQuery.landArea.$gte = startLandArea;
            }
            if (endLandArea > 0) {
                searchQuery.landArea.$lte = endLandArea;
            }
        }
        // If no search term or other filters exist, remove $or from searchQuery
        if (!((_a = searchQuery.$or) === null || _a === void 0 ? void 0 : _a.length)) {
            delete searchQuery.$or;
        }
        // Pagination settings
        const skip = (page - 1) * limit;
        // Fetch properties based on the searchQuery
        const properties = yield Property_1.default.find(searchQuery).sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        // Get total record count for pagination
        const totalRecords = yield Property_1.default.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalRecords / limit);
        // Return response with pagination data
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: properties,
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
exports.getAllProperties = getAllProperties;
const updateProperty = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const propertyId = req.params.id;
        const payload = req.body;
        const updatedProperty = yield Property_1.default.findByIdAndUpdate(propertyId, payload, { new: true } // Return the updated document
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
        const result = yield Property_1.default.findOneAndUpdate({ _id: propertyId }, { $pull: {
                images: req.body.filename
            } }).exec();
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