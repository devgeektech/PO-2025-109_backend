"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthenticate = exports.checkParamsHaveId = void 0;
const default_json_1 = __importDefault(require("../../config/default.json"));
const http_errors_1 = require("../utils/http-errors");
const messages_1 = require("../constants/messages");
const jwt_util_1 = require("../utils/jwt.util");
const checkParamsHaveId = (req, res, next) => {
    if (!req.params.id) {
        throw new http_errors_1.HTTP400Error("Missing id params");
    }
    else {
        next();
    }
};
exports.checkParamsHaveId = checkParamsHaveId;
const checkAuthenticate = (req, res, next) => {
    const token = req.get(default_json_1.default.AUTHORIZATION);
    if (!token) {
        throw new http_errors_1.HTTP400Error({ statusCode: 401, message: messages_1.MESSAGES.TOKEN_REQUIRED });
    }
    return jwt_util_1.JWTUtilities.verifyToken(token)
        .then((result) => {
        next();
    })
        .catch((error) => {
        throw new http_errors_1.HTTP403Error({ statusCode: 403, message: error.message });
    });
};
exports.checkAuthenticate = checkAuthenticate;
//# sourceMappingURL=common.middleware.js.map