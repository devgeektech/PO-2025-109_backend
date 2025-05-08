"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProperty = void 0;
const error_handler_1 = require("../../../utils/error-handler");
const http_errors_1 = require("../../../utils/http-errors");
const response_util_1 = require("../../../utils/response.util");
const joi_1 = __importDefault(require("joi"));
const validateProperty = (req, res, next) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().trim().required(),
        address: joi_1.default.string().trim().required(),
        propertyType: joi_1.default.string().valid("house", "villa", "apartment").required(),
        description: joi_1.default.string().trim().required(),
        propertySize: joi_1.default.number().positive().required(),
        bedrooms: joi_1.default.number().integer().min(1).required(),
        bathrooms: joi_1.default.number().integer().min(1).required(),
        coordinate: joi_1.default.object({
            latitude: joi_1.default.number(),
            longitude: joi_1.default.number(),
        }),
        facilities: joi_1.default.object({
            carParking: joi_1.default.boolean(),
            swimming: joi_1.default.boolean(),
            gymAndFit: joi_1.default.boolean(),
            restaurant: joi_1.default.boolean(),
            wifi: joi_1.default.boolean(),
            petCenter: joi_1.default.boolean(),
            sportsClub: joi_1.default.boolean(),
            laundry: joi_1.default.boolean(),
        }),
        price: joi_1.default.number().positive().required(),
        images: joi_1.default.array().items(joi_1.default.string())
    });
    console.log(req.body);
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const messageArr = (0, error_handler_1.errorMessageHander)(error.details);
        throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
            code: 400,
            message: messageArr[0],
        }));
    }
    else {
        req.body = value;
        next();
    }
};
exports.validateProperty = validateProperty;
//# sourceMappingURL=check.js.map