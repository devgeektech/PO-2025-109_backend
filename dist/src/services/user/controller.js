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
exports.verifyGoogleAuth = exports.getProfileById = exports.registerPhone = exports.getProfile = exports.updateProfile = exports.updateNotificationPreference = exports.deleteAccount = exports.resendOTP = exports.appleLogin = exports.facebookLogin = exports.verifyOtp = exports.verifyResetLink = exports.forgotPassword = exports.loginUser = exports.registerUser = exports.updateUserStatus = exports.fetchUsers = exports.googleAuth = void 0;
const moment_1 = __importDefault(require("moment"));
const uuid_1 = require("uuid");
const ejs_1 = __importDefault(require("ejs"));
const generateOTP = (length = 6) => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
const firebase_1 = __importDefault(require("../../utils/firebase"));
const response_util_1 = require("../../utils/response.util");
const messages_1 = require("../../constants/messages");
const Users_1 = __importDefault(require("../../models/Users"));
const jwt_util_1 = require("../../utils/jwt.util");
const MailerUtilities_1 = require("../../utils/MailerUtilities");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_util_1 = require("../../utils/bcrypt.util");
const googleAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 400,
                message: messages_1.MESSAGES.TOKEN_REQUIRED,
            });
        }
        const decodedToken = yield firebase_1.default.auth().verifyIdToken(idToken);
        const { email, name, uid } = decodedToken;
        if (!email) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 400,
                message: messages_1.MESSAGES.EMAIL_REQUIRED_MESSAGE,
            });
        }
        let user = yield Users_1.default.findOne({ email });
        if (!user) {
            user = new Users_1.default({
                fullName: name,
                email,
                authProvider: 'google',
                isGuest: false,
                role: 'user',
                googleUid: uid
            });
            yield user.save();
        }
        const token = jwt_util_1.JWTUtilities.generateToken(user._id, email);
        user.accessToken = token;
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 200,
            message: messages_1.MESSAGES.LOGIN_SUCCESSFUL,
            data: user
        });
    }
    catch (error) {
        let errorMessage = null;
        let statusCode;
        if (error.errorInfo.code === 'auth/id-token-expired') {
            statusCode = 400;
            errorMessage = messages_1.MESSAGES.FIREBASE_TOKEN_EXPIRED;
        }
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: statusCode || 500,
            message: errorMessage || messages_1.MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
});
exports.googleAuth = googleAuth;
const fetchUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchTerm = req.query.search || '';
        const searchQuery = {
            isDeleted: false,
            role: 'user',
            $or: [
                { email: { $regex: searchTerm, $options: 'i' } },
                { phoneNumber: { $regex: searchTerm, $options: 'i' } }
            ]
        };
        const skip = (page - 1) * limit;
        const users = yield Users_1.default.find(searchQuery)
            .skip(skip)
            .limit(limit);
        const totalUsers = yield Users_1.default.countDocuments({
            isDeleted: false,
            role: 'user',
        });
        const totalPages = Math.ceil(totalUsers / limit);
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 200,
            message: messages_1.MESSAGES.USERS_FETCHED_SUCCESSFULLY,
            data: users,
            pagination: {
                totalPages,
                currentPage: page,
                limit,
                totalRecords: totalUsers
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.fetchUsers = fetchUsers;
const updateUserStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { isBlocked } = req.body;
        if (typeof isBlocked !== 'boolean') {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 400,
                message: messages_1.MESSAGES.INVALID_INPUT
            });
        }
        const user = yield Users_1.default.findById(id);
        if (!user || user.isDeleted) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 400,
                message: messages_1.MESSAGES.USER_CANNOT_BE_FOUND
            });
        }
        user.isBlocked = isBlocked;
        yield user.save();
        const statusMessage = isBlocked ? messages_1.MESSAGES.USER_STATUS_UPDATED.deactivated : messages_1.MESSAGES.USER_STATUS_UPDATED.activated;
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 200,
            message: statusMessage,
            data: { userId: user._id, isBlocked: user.isBlocked },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserStatus = updateUserStatus;
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { fullName, email, phoneNumber, password, authProvider, deviceToken } = req.body;
    try {
        if (!authProvider) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 400,
                message: messages_1.MESSAGES.AUTH_PROVIDER_REQUIRED,
            });
        }
        if (authProvider === "email") {
            if (!email || !password) {
                return response_util_1.ResponseUtilities.sendResponsData({
                    statusCode: 400,
                    message: messages_1.MESSAGES.EMAIL_PASSWORD_REQUIRED,
                });
            }
            // Check if user already exists with the given email or phone number
            const existingUser = yield Users_1.default.findOne({
                $or: [{ email }],
            });
            if (existingUser) {
                return response_util_1.ResponseUtilities.sendResponsData({
                    statusCode: 400,
                    message: messages_1.MESSAGES.USER_ALREADY_EXISTS,
                });
            }
            const otp = generateOTP();
            const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);
            const newUser = new Users_1.default({
                fullName,
                email,
                phoneNumber,
                password,
                authProvider,
                otp,
                otpExpiredAt: otpExpiration,
                deviceToken
            });
            yield newUser.save();
            const message = yield ejs_1.default.renderFile(process.cwd() + "/src/views/forgotPasswordEmail.ejs", { otp }, { async: true });
            yield MailerUtilities_1.MailerUtilities.sendSendgridMail({
                recipient_email: [email],
                subject: "Registration Verification",
                text: message,
            });
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 200,
                message: messages_1.MESSAGES.OTP_SENT,
                data: {
                    phoneNumber: newUser.phoneNumber,
                    otpExpiredAt: otpExpiration,
                    otp,
                },
            });
        }
        else {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 400,
                message: messages_1.MESSAGES.INVALID_AUTH_PROVIDER, // Handle unknown auth providers
            });
        }
    }
    catch (error) {
        console.error("Server error during registration:", error);
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 500,
            message: messages_1.MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber, password, authProvider } = req.body;
    try {
        let user;
        if (authProvider === 'guest') {
            const sessionId = (0, uuid_1.v4)();
            const guestSessionExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24-hour session
            const accessToken = jwt_util_1.JWTUtilities.generateGuestToken(sessionId, '24h'); // 24-hour guest session
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 200,
                message: messages_1.MESSAGES.REGISTRATION_SUCCESSFUL,
                data: {
                    sessionId,
                    accessToken,
                    guestSessionExpiredAt: guestSessionExpiration,
                },
            });
        }
        if (phoneNumber) {
            user = yield Users_1.default.findOne({ phoneNumber });
            if (user && (user === null || user === void 0 ? void 0 : user.otpVerified) === false) {
                return response_util_1.ResponseUtilities.sendResponsData({
                    statusCode: 401,
                    message: messages_1.MESSAGES.USER_NOT_VERIFIED,
                });
            }
            const otp = generateOTP();
            const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 min
            if (!user) {
                user = new Users_1.default({
                    phoneNumber,
                    otp,
                    otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
                    otpVerified: false,
                    authProvider: 'phone',
                    role: 'user',
                });
            }
            user.otp = otp;
            user.otpExpiresAt = otpExpiration;
            yield user.save();
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 200,
                message: messages_1.MESSAGES.OTP_SENT,
                data: {
                    phoneNumber: user.phoneNumber,
                    otpExpiredAt: otpExpiration,
                    otp
                },
            });
        }
        if (email) {
            user = yield Users_1.default.findOne({ email });
            if (!user) {
                return response_util_1.ResponseUtilities.sendResponsData({
                    statusCode: 400,
                    message: messages_1.MESSAGES.USER_CANNOT_BE_FOUND,
                });
            }
            if (user && (user === null || user === void 0 ? void 0 : user.otpVerified) === false) {
                return response_util_1.ResponseUtilities.sendResponsData({
                    statusCode: 401,
                    message: messages_1.MESSAGES.USER_NOT_VERIFIED,
                });
            }
            const enteredPasswordTrimmed = password.trim();
            const hashedPasswordFromDB = user.password.trim();
            const isMatch = yield bcrypt_util_1.BcryptUtilities.VerifyPassword(enteredPasswordTrimmed, hashedPasswordFromDB);
            if (!isMatch) {
                return response_util_1.ResponseUtilities.sendResponsData({
                    statusCode: 401,
                    message: messages_1.MESSAGES.INVALID_CREDENTIALS,
                });
            }
            const token = jwt_util_1.JWTUtilities.generateToken(user._id, email);
            user.accessToken = token;
            yield user.save();
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 200,
                message: messages_1.MESSAGES.LOGIN_SUCCESSFUL,
                data: {
                    _id: user._id,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    accessToken: token,
                    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
                },
            });
        }
    }
    catch (error) {
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 500,
            message: messages_1.MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.loginUser = loginUser;
const forgotPassword = (body, next) => __awaiter(void 0, void 0, void 0, function* () {
    let userRes = yield Users_1.default.findOne({ email: body.email, isDeleted: false });
    if (userRes) {
        let randomOTP = generateOTP();
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
        const { email, otp } = query;
        const user = yield Users_1.default.findOne({ email: email.toString().toLowerCase(), isDeleted: false }).lean();
        if (!user) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 400,
                message: messages_1.MESSAGES.INVALID_LINK
            });
        }
        let trimmedOtp = otp.trim();
        let userOtpTrimmed = user.otp.trim();
        console.log(user.otp != otp);
        if (trimmedOtp != userOtpTrimmed) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 400,
                message: messages_1.MESSAGES.INVALID_LINK
            });
        }
        if ((0, moment_1.default)().isAfter((0, moment_1.default)(user.otpExipredAt))) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 400,
                message: messages_1.MESSAGES.INVALID_LINK
            });
        }
        yield Users_1.default.updateOne({ email: email.toString().toLowerCase() }, { $set: { otp: "", otpVerified: true } });
        // await user.save();
        return response_util_1.ResponseUtilities.sendResponsData({
            codeStatus: 200,
            message: messages_1.MESSAGES.LINK_VERIFIED,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.verifyResetLink = verifyResetLink;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    try {
        const user = yield Users_1.default.findOne({ email });
        console.log('dfsaasd', user);
        if (!user) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 400,
                message: messages_1.MESSAGES.OTP_VERIFICATION_FAILED
            });
        }
        if (user.otp !== otp) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 400,
                message: messages_1.MESSAGES.INVALID_OTP
            });
        }
        if (new Date() > user.otpExpiresAt) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 400,
                message: messages_1.MESSAGES.EXPIRED_OTP
            });
        }
        user.otpVerified = true;
        user.otp = '';
        user.otpExpiresAt = undefined;
        yield user.save();
        // const token = generateToken(savedUser._id.toString(), savedUser.email || savedUser.phoneNumber);
        const token = jwt_util_1.JWTUtilities.generateToken(user._id.toString(), 'email', '1h', user.email);
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 200,
            message: messages_1.MESSAGES.LOGIN_SUCCESSFUL,
            data: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                accessToken: token,
            },
        });
    }
    catch (error) {
        console.log(error);
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 500,
            message: messages_1.MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.verifyOtp = verifyOtp;
const facebookLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 400,
                message: messages_1.MESSAGES.TOKEN_REQUIRED,
            });
        }
        const decodedToken = yield firebase_1.default.auth().verifyIdToken(idToken);
        console.log(decodedToken);
        if (!decodedToken || !decodedToken.uid) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 400,
                message: messages_1.MESSAGES.INVALID_TOKEN,
            });
        }
        const { uid, email, name } = decodedToken;
        // if (sign_in_provider !== 'facebook.com') {
        //   return res.status(401).json({ message: 'Invalid Provider' });
        // }
        let user = yield Users_1.default.findOne(email);
        if (!user) {
            user = new Users_1.default({
                fullName: name,
                email: email,
                authProvider: 'facebook',
                facebookUid: uid,
                isGuest: false,
            });
            yield user.save();
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 200,
                message: messages_1.MESSAGES.LOGIN_SUCCESSFUL,
                data: user
            });
        }
        else {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 200,
                message: messages_1.MESSAGES.EMAIL_ALREADY_EXIST,
            });
        }
    }
    catch (error) {
        console.error('Facebook login error:', error);
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 500,
            message: messages_1.MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
});
exports.facebookLogin = facebookLogin;
const appleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idToken, fullName } = req.body;
        if (!idToken) {
            return res.status(400).json({ message: "idToken is required" });
        }
        const decodedToken = yield firebase_1.default.auth().verifyIdToken(idToken);
        if (!decodedToken) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 400,
                message: messages_1.MESSAGES.TOKEN_REQUIRED,
            });
        }
        const { uid, email } = decodedToken;
        let user = yield Users_1.default.findOne(email);
        // let user = await Users.findOne({ appleUid: uid });
        if (!user) {
            user = new Users_1.default({
                fullName: fullName || "",
                email,
                authProvider: "apple",
                appleUid: uid,
                isGuest: false,
                role: "user",
            });
            yield user.save();
        }
        // Generate a JWT token for session management
        // const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret", {
        //   expiresIn: "7d",
        // });
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 200,
            message: messages_1.MESSAGES.LOGIN_SUCCESSFUL,
            data: user
        });
    }
    catch (error) {
        console.error("Apple Login Error:", error);
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 500,
            message: messages_1.MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
});
exports.appleLogin = appleLogin;
const resendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phoneNumber } = req.body;
        if (!phoneNumber) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 400,
                message: messages_1.MESSAGES.EMAIL_OR_PHONE_REQUIRED,
            });
        }
        // const user:any = await Users.findOne({
        //   $or: [{ email }, { phoneNumber }],
        // });
        let user = yield Users_1.default.findOne({ phoneNumber });
        if (!user) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 404,
                message: messages_1.MESSAGES.USER_CANNOT_BE_FOUND
            });
        }
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        yield user.save();
        if (user.email) {
            const message = yield ejs_1.default.renderFile(process.cwd() + "/src/views/forgotPasswordEmail.ejs", { otp }, { async: true });
            yield MailerUtilities_1.MailerUtilities.sendSendgridMail({
                recipient_email: [user.email],
                subject: "Registration Verification",
                text: message,
            });
        }
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 200,
            message: messages_1.MESSAGES.OTP_SENT,
            otp: otp
        });
    }
    catch (error) {
        console.error("Error resending OTP:", error);
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 500,
            message: messages_1.MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
});
exports.resendOTP = resendOTP;
const deleteAccount = (token, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = yield jwt_util_1.JWTUtilities.getDecoded(token);
    try {
        const user = yield Users_1.default.findById(decoded._id);
        console.log(user);
        if (!user) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 404,
                message: messages_1.MESSAGES.USER_CANNOT_BE_FOUND
            });
        }
        yield Users_1.default.findByIdAndDelete(user.id);
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 200,
            message: messages_1.MESSAGES.ACCOUNT_DELETED_SUCCESSFULLY
        });
    }
    catch (error) {
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 500,
            message: messages_1.MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
});
exports.deleteAccount = deleteAccount;
const updateNotificationPreference = (token, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = yield jwt_util_1.JWTUtilities.getDecoded(token);
    try {
        const user = yield Users_1.default.findById(decoded._id);
        if (!user) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 404,
                message: messages_1.MESSAGES.USER_CANNOT_BE_FOUND
            });
        }
        const { notificationsEnabled } = req.body;
        if (typeof notificationsEnabled !== 'boolean') {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 400,
                message: messages_1.MESSAGES.INVALID_NOTIFICATIONS_ENABLED
            });
        }
        user.notificationsEnabled = notificationsEnabled;
        yield user.save();
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 200,
            message: messages_1.MESSAGES.NOTIFICATION_SETTINGS_UPDATED
        });
    }
    catch (error) {
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 500,
            message: messages_1.MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
});
exports.updateNotificationPreference = updateNotificationPreference;
const updateProfile = (token, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!token) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 401,
                message: messages_1.MESSAGES.TOKEN_REQUIRED
            });
        }
        const decoded = yield jwt_util_1.JWTUtilities.getDecoded(token);
        const { fullName, about } = req.body;
        const userId = decoded.id;
        let user = yield Users_1.default.findById(userId);
        if (!user) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 404,
                message: messages_1.MESSAGES.USER_CANNOT_BE_FOUND
            });
        }
        const payload = {
            fullName,
            about,
        };
        if (req.files && req.files.length) {
            let files = req.files;
            payload.profilePicture = (_a = files[0]) === null || _a === void 0 ? void 0 : _a.filename;
        }
        user = yield Users_1.default.findOneAndUpdate({ _id: userId }, { $set: payload }, { new: true });
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 404,
            message: messages_1.MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,
            data: user,
        });
    }
    catch (error) {
        console.error(error);
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 500,
            message: messages_1.MESSAGES.USER_CANNOT_BE_FOUND
        });
    }
});
exports.updateProfile = updateProfile;
const getProfile = (token, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = yield jwt_util_1.JWTUtilities.getDecoded(token);
        const userId = decoded.id;
        const user = yield Users_1.default.findById(userId).select("-accessToken");
        if (!user) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 404,
                message: messages_1.MESSAGES.USER_CANNOT_BE_FOUND
            });
        }
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 200,
            message: messages_1.MESSAGES.USERS_FETCHED_SUCCESSFULLY,
            data: Object.assign(Object.assign({}, user.toObject()), { deviceToken: user.deviceToken })
        });
    }
    catch (error) {
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 200,
            message: messages_1.MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.getProfile = getProfile;
const registerPhone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber } = req.body;
    let STATIC_OTP = 123456;
    try {
        let user = yield Users_1.default.findOne({ phoneNumber });
        if (!user) {
            user = new Users_1.default({ phoneNumber });
        }
        user.otp = STATIC_OTP;
        user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        yield user.save();
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 200,
            message: messages_1.MESSAGES.OTP_SENT,
            otp: STATIC_OTP
        });
    }
    catch (error) {
        console.error("Error during phone registration:", error);
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 500,
            message: messages_1.MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
});
exports.registerPhone = registerPhone;
const getProfileById = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield Users_1.default.findById(userId).select("-accessToken");
        if (!user) {
            return response_util_1.ResponseUtilities.sendResponsData({
                statusCode: 404,
                message: messages_1.MESSAGES.USER_CANNOT_BE_FOUND
            });
        }
        return response_util_1.ResponseUtilities.sendResponsData({
            statusCode: 200,
            message: messages_1.MESSAGES.USERS_FETCHED_SUCCESSFULLY,
            data: user
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getProfileById = getProfileById;
const verifyGoogleAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idToken, role } = req.body;
        if (!idToken || !role) {
            return res.status(400).json({ message: "ID Token and Role are required" });
        }
        // Verify Google ID Token
        const decodedToken = yield firebase_1.default.auth().verifyIdToken(idToken);
        const { email, name, uid } = decodedToken;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        // Find user in MongoDB
        let user = yield Users_1.default.findOne({ email });
        // If user doesn't exist, create new user
        if (!user) {
            user = new Users_1.default({
                fullName: name,
                email,
                authProvider: "google",
                role,
                googleUid: uid,
            });
            yield user.save();
        }
        // Check if user is blocked, suspended, or deleted
        if (user.isBlocked) {
            return res.status(403).json({ message: "User is blocked by admin" });
        }
        if (user.isDeleted) {
            return res.status(403).json({ message: "User account is deleted" });
        }
        // Generate JWT Token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                authProvider: user.authProvider,
                role: user.role,
                accessToken: token,
            },
        });
    }
    catch (error) {
        console.error("Google Auth Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.verifyGoogleAuth = verifyGoogleAuth;
// export const loginGuestUser = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const sessionId = uuidv4();
//     const guestUser = new Users({
//       isGuest: true,
//       sessionId: sessionId,
//       guestSessionExpiredAt: moment().add(1, 'hour').toDate(),
//     })
//     await guestUser.save();
//     return EbookUtilities.sendResponsData({
//       statusCode: 200,
//       message: GUEST_LOGIN_SUCCESS,
//       data: {
//         sessionId: guestUser.sessionId,
//         guestSessionExpiredAt: guestUser.guestSessionExpiredAt,
//       }
//     });
//   } catch (error) {
//     console.log(error)
//     return EbookUtilities.sendResponsData({
//       statusCode: 500,
//       message: INTERNAL_SERVER_ERROR
//     });
//   }
// };
// export const validateGuestSession = async (req: Request, res: Response, next: any): Promise<Response | void> => {
//   try {
//     const { sessionId } = req.headers;
//     if (!sessionId) {
//       return  EbookUtilities.sendResponsData({
//         statusCode: 500,
//         message: MISSING_SESSION_ID
//       });
//     }
//     const guestUser = await Users.findOne({ sessionId, isGuest: true });
//     if (!guestUser) {
//       return  EbookUtilities.sendResponsData({
//         statusCode: 400,
//         message: INVALID_SESSION_ID
//       });
//     }
//     if (moment().isAfter(guestUser.guestSessionExpiredAt)) {
//       return  EbookUtilities.sendResponsData({
//         statusCode: 400,
//         message: GUEST_SESSION_EXPIRED
//       });
//     }
//     next();
//   } catch (error) {
//     return  EbookUtilities.sendResponsData({
//       statusCode: 500,
//       message: INTERNAL_SERVER_ERROR
//     });
//   }
// };
// export const resendOTP = async (req: Request, res: Response) => {
//   const { phoneNumber } = req.body;
//   let STATIC_OTP = 123456;
//   try {
//     const user:any = await Users.findOne({ phoneNumber });
//     if (!user) {
//       return EbookUtilities.sendResponsData({
//         statusCode: 400,
//         message: OTP_VERIFICATION_FAILED
//       })
//     }
//     if (user.otp !== otp) {
//       return EbookUtilities.sendResponsData({
//         statusCode: 400,
//         message: INVALID_OTP
//       })
//     }
//     if (new Date() > user.otpExpiresAt) {
//       return EbookUtilities.sendResponsData({
//         statusCode: 400,
//         message: EXPIRED_OTP
//       })
//     }
//     const token = generateToken(user._id.toString(), phoneNumber);
//     user.otp = 0;
//     user.otpVerified = true
//     user.otpExpiresAt = undefined;
//     await user.save();
//     return {
//       statusCode:200,
//       message: REGISTRATION_SUCCESSFUL,
//       data: {
//         _id: user._id,
//         phoneNumber: user.phoneNumber,
//         accessToken: token,
//         expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
//       },
//     };
//   } catch (error) {
//     return EbookUtilities.sendResponsData({
//       statusCode: 500,
//       message: INTERNAL_SERVER_ERROR
//     });
//   }
// };
//# sourceMappingURL=controller.js.map