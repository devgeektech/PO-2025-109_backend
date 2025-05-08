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
exports.createNewPassword = exports.changePassword = exports.verifyResetLink = exports.forgotPassword = exports.logout = exports.login = exports.createAdmin = void 0;
var mongoose = require("mongoose");
const moment_1 = __importDefault(require("moment"));
const ejs_1 = __importDefault(require("ejs"));
const Users_1 = __importDefault(require("../../models/Users"));
const http_errors_1 = require("../../utils/http-errors");
const response_util_1 = require("../../utils/response.util");
const jwt_util_1 = require("../../utils/jwt.util");
const bcrypt_util_1 = require("../../utils/bcrypt.util");
const index_1 = require("../../constants/index");
const messages_1 = require("../../constants/messages");
const utils_1 = require("../../utils");
const MailerUtilities_1 = require("../../utils/MailerUtilities");
//  Create admin if no admin exist in database  //
const createAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    let userRes = yield Users_1.default.findOne({ email: index_1.ADMIN_EMAIL, isDeleted: false });
    if (!userRes) {
        const adminArr = index_1.ADMIN_USERS;
        console.log('Admin created successfully.');
        return yield Users_1.default.create(adminArr);
    }
    else {
        userRes.role = index_1.ADMIN;
        return yield userRes.save();
    }
});
exports.createAdmin = createAdmin;
const login = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, deviceToken } = req.body;
        const user = yield Users_1.default.findOne({ email: email, isDeleted: false });
        if (!user) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.USER_ERRORS.USER_NOT_EXIST,
            }));
        }
        const passwordMatch = yield bcrypt_util_1.BcryptUtilities.VerifyPassword(password, user.password);
        if (!passwordMatch) {
            console.log(password, user.password, passwordMatch);
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.USER_ERRORS.INVALID_PASSWORD,
            }));
        }
        if (!user.otpVerified) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.USER_ERRORS.USER_ACCOUNT_NOT_VERIFIED,
            }));
        }
        let userToken = yield jwt_util_1.JWTUtilities.createJWTToken({
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        });
        user.accessToken = userToken;
        user.deviceToken = deviceToken;
        yield user.save();
        let result = {
            userDetail: user,
            token: userToken
        };
        return response_util_1.ResponseUtilities.sendResponsData({ code: 200, message: 'Success', data: result });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const logout = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = yield jwt_util_1.JWTUtilities.getDecoded(token);
    let userRes = yield Users_1.default.findOne({
        _id: mongoose.Types.ObjectId(decoded.id),
        isDeleted: false
    });
    if (userRes) {
        userRes.accessToken = "";
        yield userRes.save();
        return response_util_1.ResponseUtilities.sendResponsData({ code: 200, message: "Success" });
    }
    else {
        throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
            code: 400,
            message: messages_1.MESSAGES.USER_ERRORS.USER_NOT_EXIST,
        }));
    }
});
exports.logout = logout;
const forgotPassword = (body, next) => __awaiter(void 0, void 0, void 0, function* () {
    let userRes = yield Users_1.default.findOne({ email: body.email, isDeleted: false });
    if (userRes) {
        let randomOTP = (0, utils_1.generateOTP)();
        // let forgotPasswordLink = `http://localhost:3001/auth/change-password?id=${userRes._id.toString()}&otp=${randomOTP}`;
        // userRes.forgotPasswordLink = forgotPasswordLink;
        userRes.linkVerified = false;
        userRes.linkExipredAt = (0, moment_1.default)().add(5, 'm');
        let message = yield ejs_1.default.renderFile(process.cwd() + "/src/views/forgotPasswordEmail.ejs", { otp: randomOTP }, { async: true });
        let mailResponse = yield MailerUtilities_1.MailerUtilities.sendSendgridMail({ recipient_email: [body.email], subject: "Forgot Password", text: message });
        userRes['otp'] = randomOTP;
        userRes['otpVerified'] = false;
        userRes['otpExipredAt'] = (0, moment_1.default)().add(10, "m");
        yield userRes.save();
        return response_util_1.ResponseUtilities.sendResponsData({ statusCode: 200, message: messages_1.MESSAGES.MAIL_SENT });
    }
    else {
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 404, message: messages_1.MESSAGES.USER_CANNOT_BE_FOUND
        });
    }
});
exports.forgotPassword = forgotPassword;
const verifyResetLink = (params, query, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield Users_1.default.findById(params.id);
        if (!user) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.LINK_ERRORS.INVALID_LINK
            }));
        }
        console.log(user.otp != query.otp);
        if (user.otp != query.otp) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.LINK_ERRORS.INVALID_LINK
            }));
        }
        if ((0, moment_1.default)().isAfter((0, moment_1.default)(user.otpExipredAt))) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.LINK_ERRORS.INVALID_LINK
            }));
        }
        user.otp = 0;
        user.otpVerified = true;
        yield user.save();
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: 'The link has been verified successfully',
            data: user
        });
    }
    catch (error) {
        next(error);
    }
});
exports.verifyResetLink = verifyResetLink;
//  Change password  //
const changePassword = (bodyData, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    let userRes = yield Users_1.default.findOne({ _id: mongoose.Types.ObjectId(adminId), isDeleted: false });
    if (userRes) {
        userRes.password = bodyData.password;
        userRes.save();
        return response_util_1.ResponseUtilities.sendResponsData({ code: 200, message: 'Success', data: userRes });
    }
    else {
        throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({ code: 400, message: messages_1.MESSAGES.USER_ERRORS.INVALID_LOGIN }));
    }
});
exports.changePassword = changePassword;
const createNewPassword = (body, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp } = body;
        let userRes = yield Users_1.default.findOne({
            email: body.email,
            isDeleted: false,
        });
        if (userRes) {
            // let messageHtml = await ejs.renderFile(
            //   process.cwd() + "/src/views/changePassword.email.ejs",
            //   { name: userRes.firstName.charAt(0).toUpperCase() + userRes.firstName.slice(1) },
            //   { async: true }
            // );
            // let mailResponse = await MailerUtilities.sendSendgridMail({ recipient_email: [body.email], subject: "Forgot Password", text: message });
            // let mailData = await MailerUtilities.sendSendgridMail(userRes.email, '', messageHtml, "Change Password");
            // let mailResponse = await MailerUtilities.sendSendgridMail({ recipient_email: [body.email], subject: "Change", text: messageHtml });
            if (userRes.otp !== otp) {
                return response_util_1.ResponseUtilities.sendResponsData({
                    statusCode: 400,
                    message: messages_1.MESSAGES.INVALID_OTP
                });
            }
            if (new Date() > userRes.otpExpiresAt) {
                return response_util_1.ResponseUtilities.sendResponsData({
                    statusCode: 400,
                    message: messages_1.MESSAGES.EXPIRED_OTP
                });
            }
            userRes.otpVerified = true;
            userRes.otp = '';
            userRes.otpExpiresAt = undefined;
            userRes.password = body.password;
            yield userRes.save();
            return response_util_1.ResponseUtilities.sendResponsData({
                code: 200,
                message: messages_1.MESSAGES.USER_ERRORS.PASSWORD_UPDATED,
                data: userRes
            });
        }
        else {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.USER_ERRORS.USER_NOT_EXIST,
            }));
        }
    }
    catch (error) {
        next(error);
    }
});
exports.createNewPassword = createNewPassword;
//# sourceMappingURL=controller.js.map