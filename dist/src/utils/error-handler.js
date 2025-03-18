"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMessageHander = exports.defaultError = exports.invalidTokenError = exports.serverError = exports.clientError = exports.CommonErrorHandler = exports.notFoundError = void 0;
const http_errors_1 = require("./http-errors");
const notFoundError = () => {
    throw new http_errors_1.HTTP404Error({ responseCode: 404, responseMessage: "Method not found." });
};
exports.notFoundError = notFoundError;
const CommonErrorHandler = (statusCode, message) => {
    let data = { statusCode, message: [message] };
    return data;
};
exports.CommonErrorHandler = CommonErrorHandler;
const clientError = (err, res, next) => {
    if (err instanceof http_errors_1.HTTPClientError) {
        console.warn(err);
        res.status(err.statusCode).send(err.message);
    }
    else {
        next(err);
    }
};
exports.clientError = clientError;
const serverError = (err, res, next) => {
    console.error(err);
    if (process.env.NODE_ENV === "production") {
        res.status(500).send("Internal Server Error");
    }
    else {
        res.status(500).send(err.stack);
    }
};
exports.serverError = serverError;
const invalidTokenError = () => {
    throw new http_errors_1.HTTP403Error({ responseCode: 403, responseMessage: "Invalid Token", data: {} });
};
exports.invalidTokenError = invalidTokenError;
const defaultError = (message) => {
    throw new http_errors_1.HTTP400Error({ responseCode: 400, responseMessage: message ? message : "Failed", data: {} });
};
exports.defaultError = defaultError;
const errorMessageHander = (data) => {
    let errorArr = [];
    Object.keys(data).forEach(function (key) {
        errorArr.push(data[key].message);
    });
    return errorArr;
};
exports.errorMessageHander = errorMessageHander;
//# sourceMappingURL=error-handler.js.map