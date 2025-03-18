"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkResendOTP = exports.checkPassword = exports.checkOTP = exports.checkSignup = exports.checkChangePassword = exports.checkForgotPassword = exports.validate = void 0;
const error_handler_1 = require("../../../utils/error-handler");
const http_errors_1 = require("../../../utils/http-errors");
const response_util_1 = require("../../../utils/response.util");
const joi_1 = __importDefault(require("joi"));
const validate = (req, res, next) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().trim(true).required().messages({
            "string.empty": "Email can not be empty",
            "string.email": `Email should be a valid email`
        }),
        password: joi_1.default.string().trim(true).required().messages({ "string.empty": "Password can not be empty" }),
        role: joi_1.default.string().optional(),
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
const checkForgotPassword = (req, res, next) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().trim(true).required().messages({
            "string.empty": "Email can not be empty",
            "string.email": "Email should be a valid email"
        })
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
exports.checkForgotPassword = checkForgotPassword;
const checkChangePassword = (req, res, next) => {
    // Password must include atleast 8 characters including 1 number and 1 special character
    const schema = joi_1.default.object({
        password: joi_1.default.string().trim(true).required().messages({ "string.empty": "Password can not be empty" }),
        email: joi_1.default.string().email().trim(true).required().messages({
            "string.empty": "Email can not be empty",
            "string.email": "Email should be a valid email"
        }),
        otp: joi_1.default.string().trim(true).required().messages({
            "string.empty": "OTP can not be empty"
        })
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
exports.checkChangePassword = checkChangePassword;
const checkSignup = (req, res, next) => {
    const schema = joi_1.default.object({
        fullName: joi_1.default.string().trim(true).required().messages({
            "string.empty": "Full Name can not be empty",
        }),
        email: joi_1.default.string().email().trim(true).required().messages({
            "string.empty": "Email can not be empty",
            "string.email": "Email should be a valid email"
        }),
        password: joi_1.default.string().min(6).trim(true).required().messages({
            "string.empty": "Password can not be empty",
        }),
        authProvider: joi_1.default.string().trim()
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
exports.checkSignup = checkSignup;
const checkOTP = (req, res, next) => {
    // Password must include atleast 8 characters including 1 number and 1 special character
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().trim(true).required().messages({
            "string.empty": "Email can not be empty",
            "string.email": "Email should be a valid email"
        }),
        otp: joi_1.default.string().trim(true).required().messages({
            "string.empty": "OTP can not be empty"
        })
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
exports.checkOTP = checkOTP;
const checkPassword = (req, res, next) => {
    // Password must include atleast 8 characters including 1 number and 1 special character
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().trim(true).required().messages({
            "string.empty": "Email can not be empty",
            "string.email": "Email should be a valid email"
        }),
        password: joi_1.default.string()
            .trim(true)
            .min(8)
            .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
            .required()
            .messages({
            "string.empty": "Password can not be empty",
            "string.min": "Password must include atleast 8 characters",
            "string.pattern.base": "Password must include atleast 1 number and 1 special character"
        })
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
exports.checkPassword = checkPassword;
const checkResendOTP = (req, res, next) => {
    // Password must include atleast 8 characters including 1 number and 1 special character
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().trim(true).required().messages({
            "string.empty": "Email can not be empty",
            "string.email": "Email should be a valid email"
        })
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
exports.checkResendOTP = checkResendOTP;
//# sourceMappingURL=check.js.map