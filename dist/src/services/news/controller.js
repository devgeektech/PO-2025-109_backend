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
exports.deleteNews = exports.updateNews = exports.getAllNews = exports.getNewsInsights = exports.getNewsById = exports.createNews = void 0;
const http_errors_1 = require("../../utils/http-errors");
const response_util_1 = require("../../utils/response.util");
const messages_1 = require("../../constants/messages");
const News_1 = __importDefault(require("../../models/News"));
const createNews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const payload = req.body;
        const news = new News_1.default(payload);
        console.log(req.files);
        if (req.files && req.files.length) {
            let filesData = (_a = req.files[0]) === null || _a === void 0 ? void 0 : _a.filename;
            news.image = filesData;
        }
        yield news.save();
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: news,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.createNews = createNews;
const getNewsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newsId = req.params.id;
        const property = yield News_1.default.findById(newsId).exec();
        if (!property) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.NEWS_ERRORS.NEWS_NOT_EXIST,
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
exports.getNewsById = getNewsById;
const getNewsInsights = (next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newsInsights = yield News_1.default.aggregate([
            {
                $match: { isDeleted: false }
            },
            {
                $group: {
                    _id: null,
                    totalNews: { $sum: 1 }, // Counts the number of documents
                    totalViews: { $sum: { $size: "$views" } } // Sums the length of the views array
                }
            }
        ]);
        const response = newsInsights.length > 0
            ? { news: newsInsights[0].totalNews, views: newsInsights[0].totalViews }
            : { news: 0, views: 0 };
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: response,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getNewsInsights = getNewsInsights;
const getAllNews = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchTerm = req.query.search || "";
        const category = req.query.category || "";
        // Initialize the searchQuery object
        let searchQuery = {
            isDeleted: false,
            $or: [],
        };
        // Add search term filter if provided
        if (searchTerm) {
            searchQuery.$or.push({ title: { $regex: searchTerm, $options: 'i' } });
        }
        // Add propertyType filter if provided
        if (category) {
            searchQuery.category = category;
        }
        // If no search term or other filters exist, remove $or from searchQuery
        if (!((_a = searchQuery.$or) === null || _a === void 0 ? void 0 : _a.length)) {
            delete searchQuery.$or;
        }
        // Pagination settings
        const skip = (page - 1) * limit;
        // Fetch properties based on the searchQuery
        const newsList = yield News_1.default.find(searchQuery).sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        // Get total record count for pagination
        const totalRecords = yield News_1.default.countDocuments(searchQuery);
        // Return response with pagination data
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: newsList,
            total: totalRecords,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllNews = getAllNews;
const updateNews = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const propertyId = req.params.id;
        const payload = req.body;
        const updatedProperty = yield News_1.default.findByIdAndUpdate(propertyId, payload, { new: true } // Return the updated document
        ).exec();
        if (!updatedProperty) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.NEWS_ERRORS.NEWS_NOT_EXIST,
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
exports.updateNews = updateNews;
const deleteNews = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const propertyId = req.params.id;
        const result = yield News_1.default.findOneAndUpdate({ _id: propertyId }, { isDeleted: true }).exec();
        if (!result) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.NEWS_ERRORS.NEWS_NOT_EXIST,
            }));
        }
        return response_util_1.ResponseUtilities.sendResponsData({ code: 200, message: "Success" }); // Return true if deletion was successful
    }
    catch (error) {
        next(error);
    }
});
exports.deleteNews = deleteNews;
//# sourceMappingURL=controller.js.map