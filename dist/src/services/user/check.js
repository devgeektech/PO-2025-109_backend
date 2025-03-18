"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileValidator = exports.verifyOtpValidator = exports.registerPhoneValidator = exports.emailValidator = exports.loginValidator = exports.registerValidator = void 0;
const messages_1 = require("../../constants/messages");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const registerValidator = (req, res, next) => {
    const { fullName, email, phoneNumber, password, authProvider } = req.body;
    const errors = [];
    if (!authProvider) {
        errors.push(messages_1.MESSAGES.INVALID_AUTH_PROVIDER);
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push(messages_1.MESSAGES.INVALID_EMAIL);
    }
    if (!password || password.length < 6) {
        errors.push(messages_1.MESSAGES.PASSWORD_REQUIRED_LENGTH);
    }
    if (!phoneNumber || !/^\+?[1-9]\d{7,14}$/.test(phoneNumber)) {
        errors.push(messages_1.MESSAGES.INVALID_PHONE_NUMBER);
    }
    if (errors.length > 0) {
        return res.status(400).json({ statusCode: 400, message: errors });
    }
    next();
};
exports.registerValidator = registerValidator;
const loginValidator = (req, res, next) => {
    const { authProvider, email, phoneNumber, password } = req.body;
    const errors = [];
    if (!authProvider || !['email', 'phone', 'guest'].includes(authProvider)) {
        errors.push(messages_1.MESSAGES.INVALID_AUTH_PROVIDER);
    }
    if (authProvider === 'email') {
        if (!email || !email.trim()) {
            errors.push(messages_1.MESSAGES.INVALID_EMAIL);
        }
        else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.push(messages_1.MESSAGES.INVALID_EMAIL);
            }
        }
    }
    if (authProvider === 'phone') {
        if (!phoneNumber || !phoneNumber.trim()) {
            errors.push(messages_1.MESSAGES.PHONE_NUMBER_REQUIRED_LOGIN);
        }
        else {
            const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/; // Simple phone number regex to validate country code and number
            if (!phoneNumberRegex.test(phoneNumber)) {
                errors.push(messages_1.MESSAGES.INVALID_PHONE_NUMBER_FORMAT);
            }
        }
    }
    if (authProvider === 'email' && (!password || password.length < 6)) {
        errors.push(messages_1.MESSAGES.PASSWORD_REQUIRED_LENGTH);
    }
    if (errors.length > 0) {
        res.status(400).json({ statusCode: 400, message: errors });
        return;
    }
    next();
};
exports.loginValidator = loginValidator;
const emailValidator = (req, res, next) => {
    const { email } = req.body;
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push(messages_1.MESSAGES.INVALID_EMAIL);
    }
    if (errors.length > 0) {
        res.status(400).json({ statusCode: 400, message: errors });
        return;
    }
    next();
};
exports.emailValidator = emailValidator;
const registerPhoneValidator = (req, res, next) => {
    const { phoneNumber } = req.body;
    const errors = [];
    if (phoneNumber === undefined || phoneNumber === null || phoneNumber.trim() === "") {
        errors.push(messages_1.MESSAGES.MISSING_PHONE_NUMBER);
        res.status(400).json({ statusCode: 400, message: errors });
        return;
    }
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
        errors.push(messages_1.MESSAGES.INVALID_PHONE_NUMBER);
        res.status(400).json({ statusCode: 400, message: errors });
        return;
    }
    next();
};
exports.registerPhoneValidator = registerPhoneValidator;
const verifyOtpValidator = (req, res, next) => {
    const { email, otp } = req.body;
    const errors = [];
    if (!email || email.trim() === "") {
        errors.push(messages_1.MESSAGES.MISSING_REQUIRED_FIELDS);
    }
    // Validate otp
    if (!otp || otp.trim() === "") {
        errors.push(messages_1.MESSAGES.MISSING_OTP);
    }
    if (otp && !/^\d{6}$/.test(otp)) {
        errors.push(messages_1.MESSAGES.INVALID_OTP);
    }
    if (errors.length > 0) {
        res.status(400).json({ statusCode: 400, message: errors });
        return;
    }
    next();
};
exports.verifyOtpValidator = verifyOtpValidator;
const updateProfileValidator = (req, res, next) => {
    const { fullName, about, password } = req.body;
    const errors = [];
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 3) {
        errors.push(messages_1.MESSAGES.FULL_NAME_REQUIRED);
    }
    if (!req.file) {
        errors.push(messages_1.MESSAGES.PROFILE_PICTURE_REQUIRED);
    }
    else if (req.file.size > 2 * 1024 * 1024) { // 2MB limit
        errors.push(messages_1.MESSAGES.PROFILE_PICTURE_SIZE_LIMIT);
    }
    // if (about && (typeof about !== 'string' || about.length > 1000)) {
    //   errors.push('About section must be a string with a maximum of 1000 characters.');
    // }
    if (!password || typeof password !== 'string' || password.length < 6) {
        errors.push(messages_1.MESSAGES.PASSWORD_REQUIRED_LENGTH);
    }
    if (errors.length > 0) {
        res.status(400).json({ statusCode: 400, message: errors });
        return;
    }
    next();
};
exports.updateProfileValidator = updateProfileValidator;
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/"); // Save files in uploads directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname)); // Ensure unique filename
    },
});
// Multer configuration with file size limit and validation
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max file size
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
});
exports.default = upload;
//# sourceMappingURL=check.js.map