"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageValidate = exports.validate = void 0;
const messages_1 = require("../../../constants/messages");
const error_handler_1 = require("../../../utils/error-handler");
const http_errors_1 = require("../../../utils/http-errors");
const response_util_1 = require("../../../utils/response.util");
const joi_1 = __importDefault(require("joi"));
const validate = (req, res, next) => {
    const schema = joi_1.default.object({
        participants: joi_1.default.array().required(),
        propertyId: joi_1.default.string().required()
    });
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        let messageArr = (0, error_handler_1.errorMessageHander)(error.details);
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
exports.validate = validate;
const sendMessageValidate = (req, res, next) => {
    const schema = joi_1.default.object({
        message: joi_1.default.string().trim(true).required().messages({
            "string.empty": "Message can not be empty"
        }),
        sender: joi_1.default.string().trim(true).required().messages({
            "string.empty": "Sender can not be empty"
        }),
        receiver: joi_1.default.string().trim(true).required().messages({
            "string.empty": "Receiver can not be empty"
        }),
        images: joi_1.default.any()
    });
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        let messageArr = (0, error_handler_1.errorMessageHander)(error.details);
        throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
            code: 400,
            message: messageArr[0],
        }));
    }
    else {
        if (value.sender === value.receiver) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.SENDER_AND_RECEIVER_CANT_BE_SAME,
            }));
        }
        req.body = value;
        next();
    }
};
exports.sendMessageValidate = sendMessageValidate;
//# sourceMappingURL=check.js.map