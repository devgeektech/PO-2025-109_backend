"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInquiry = void 0;
const error_handler_1 = require("../../../utils/error-handler");
const http_errors_1 = require("../../../utils/http-errors");
const response_util_1 = require("../../../utils/response.util");
const joi_1 = __importDefault(require("joi"));
const validateInquiry = (req, res, next) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().trim().required(),
        email: joi_1.default.string().email().trim().required(),
        phone: joi_1.default.string().trim(),
        property: joi_1.default.string(),
        query: joi_1.default.string().trim(),
        isOnMarket: joi_1.default.bool()
    });
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
exports.validateInquiry = validateInquiry;
//# sourceMappingURL=check.js.map