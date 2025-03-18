"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBroadcast = void 0;
const error_handler_1 = require("../../../utils/error-handler");
const http_errors_1 = require("../../../utils/http-errors");
const response_util_1 = require("../../../utils/response.util");
const joi_1 = __importDefault(require("joi"));
const validateBroadcast = (req, res, next) => {
    const schema = joi_1.default.object({
        title: joi_1.default.string().trim().required(),
        isBroadcast: joi_1.default.bool(),
        description: joi_1.default.string().trim().required(),
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
exports.validateBroadcast = validateBroadcast;
//# sourceMappingURL=check.js.map