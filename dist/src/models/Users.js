"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
const userSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true,
    },
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
    },
    password: {
        type: String,
        minlength: 6,
    },
    authProvider: {
        type: String,
        enum: ['email', 'google', 'facebook', 'apple', 'phone', 'guest'],
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    accessToken: {
        type: String,
        default: '',
    },
    googleUid: {
        type: String,
        unique: true,
        sparse: true,
    },
    facebookUid: {
        type: String,
        unique: true,
        sparse: true,
    },
    appleUid: {
        type: String,
        unique: true,
        sparse: true,
    },
    otp: {
        type: String,
        default: '',
        trim: true,
    },
    otpVerified: {
        type: Boolean,
        default: false,
    },
    otpExpiredAt: {
        type: Date,
        default: (0, moment_1.default)().add(10, 'm').toDate(),
    },
    forgotPasswordLink: {
        type: String,
        default: '',
    },
    linkVerified: {
        type: Boolean,
        default: false,
    },
    linkExpiredAt: {
        type: Date,
        default: (0, moment_1.default)().add(1, 'hour').toDate(),
    },
    isGuest: {
        type: Boolean,
        default: false,
    },
    sessionId: {
        type: String,
        default: '',
    },
    guestSessionExpiredAt: {
        type: Date,
        default: (0, moment_1.default)().add(1, 'hour').toDate(),
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    notificationsEnabled: {
        type: Boolean,
        default: true,
    },
    profilePicture: { type: String, default: '' },
    about: { type: String, trim: true, maxlength: 500, default: '' },
    deviceToken: { type: String, default: '' },
}, {
    versionKey: false,
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password;
            delete ret.__v;
            return ret;
        },
    },
});
// Hash password before saving (if exists)
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password') && this.password) {
            this.password = yield bcrypt_1.default.hash(this.password, 10);
        }
        next();
    });
});
const Users = mongoose_1.default.model('User', userSchema);
exports.default = Users;
//# sourceMappingURL=Users.js.map