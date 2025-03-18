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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTUtilities = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const default_json_1 = __importDefault(require("../../config/default.json"));
class JWTUtilities {
}
exports.JWTUtilities = JWTUtilities;
_a = JWTUtilities;
/**
 * Create jwt token
 * @param {object} payload
 * @param {string} token - return token
 */
JWTUtilities.createJWTToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const secretKey = default_json_1.default.JWT_SECRET_KEY;
    if (typeof secretKey !== 'string') {
        throw new Error('JWT_SECRET_KEY is not defined or not a string');
    }
    return jsonwebtoken_1.default.sign(payload, secretKey, {});
});
/**
 * Verify token is valid or not
 * @param {string} token
 */
JWTUtilities.verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(function (resolve, reject) {
        jsonwebtoken_1.default.verify(token, default_json_1.default.JWT_SECRET_KEY, function (error, result) {
            return __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    return reject(error);
                }
                // const userRes = await Users.findOne({ accessToken: token });
                //     if (userRes) {
                return resolve(result);
                //   } else {
                //       return reject({ message: MESSAGES.USER_CANNOT_BE_FOUND });
                // }
            });
        });
    });
});
/**
 * decoded jwt token
 * @param token string
 */
JWTUtilities.getDecoded = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.decode(token);
});
JWTUtilities.generateGuestToken = (sessionId, expiresIn = '24H') => {
    return _a.generateToken(sessionId, 'guest', expiresIn);
};
JWTUtilities.generateToken = (_id, authProvider, expireIn = '24H', email = '') => {
    const payload = {
        _id,
        authProvider,
        email,
        issuedAt: Math.floor(Date.now() / 1000),
    };
    const secretKey = String(default_json_1.default.JWT_SECRET_KEY) || "";
    const token = jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: expireIn });
    return token;
};
//# sourceMappingURL=jwt.util.js.map