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
const controller_1 = require("./controller");
const default_json_1 = __importDefault(require("../../../config/default.json"));
const common_middleware_1 = require("../../middleware/common.middleware");
const check_1 = require("./check");
const basePath = default_json_1.default.BASE_PATH;
const currentPath = "user";
const currentPathURL = basePath + currentPath;
exports.default = [
    {
        path: currentPathURL + 'register',
        method: "post",
        handler: [
            check_1.registerValidator,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.registerUser)(req, res, next);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + 'login',
        method: "post",
        handler: [check_1.loginValidator,
            (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.loginUser)(req, res);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + "forgotPassword",
        method: "post",
        handler: [
            check_1.emailValidator,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.forgotPassword)(req.body, next);
                res.status(200).send(result);
            }),
        ],
    },
    // {
    //   path: currentPathURL + "verifyOtp",
    //   method: "post",
    //   handler: [
    //     registerPhoneValidator,
    //     async (req: Request, res: Response, next: NextFunction) => {
    //       const result = await registerPhone(req, res);
    //       res.status(200).send(result);
    //     },
    //   ],
    // },
    {
        path: currentPathURL + "registerPhone",
        method: "post",
        handler: [
            check_1.registerPhoneValidator,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.registerPhone)(req, res);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + "/verifyOtpAndRegister",
        method: "post",
        handler: [
            check_1.verifyOtpValidator,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.verifyOtp)(req, res);
                res.status(200).send(result);
            }),
        ],
    },
    // {
    //   path: currentPathURL + "login/guest",
    //   method: "post",
    //   handler: [
    //     async (req: Request, res: Response, next: NextFunction) => {
    //       const result = await loginGuestUser(req, res);
    //       res.status(200).send(result);
    //     },
    //   ],
    // },
    {
        path: currentPathURL + 'user/:id/status',
        method: "put",
        handler: [common_middleware_1.checkAuthenticate,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.updateUserStatus)(req, res, next);
                res.status(200).send(result);
            }),
        ],
    },
    // router.put('/users/:id/status', authenticate, authorize('admin'), updateUserStatus);
    {
        path: currentPathURL + "/users",
        method: "get",
        handler: [common_middleware_1.checkAuthenticate,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.fetchUsers)(req, res, next);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + 'validateOtpForgetPassword',
        method: "get",
        handler: [
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.verifyResetLink)(req.params, req.query, next);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + 'google-auth',
        method: "post",
        handler: [
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.googleAuth)(req, res);
                // /auth/google-verify
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + 'verifyGoogleLogin',
        method: "post",
        handler: [
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.verifyGoogleAuth)(req, res);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + 'facebook-auth',
        method: "post",
        handler: [
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.facebookLogin)(req, res);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + 'apple-auth',
        method: "post",
        handler: [
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.appleLogin)(req, res);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + 'resend-Otp',
        method: "post",
        handler: [
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.resendOTP)(req, res);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + 'delete-account',
        method: "delete",
        handler: [common_middleware_1.checkAuthenticate,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.deleteAccount)(req.get(default_json_1.default.AUTHORIZATION), req, res);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + 'notification-preference',
        method: "put",
        handler: [common_middleware_1.checkAuthenticate,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.updateNotificationPreference)(req.get(default_json_1.default.AUTHORIZATION), req, res);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + '/update-profile',
        method: "put",
        handler: [
            common_middleware_1.checkAuthenticate,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.updateProfile)(req.get(default_json_1.default.AUTHORIZATION), req, res);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + '/get-profile',
        method: "get",
        handler: [
            common_middleware_1.checkAuthenticate,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const result = yield (0, controller_1.getProfile)(req.get(default_json_1.default.AUTHORIZATION), req, res);
                    res.status(200).send(result);
                }
                catch (error) {
                    next(error);
                }
            }),
        ],
    },
    {
        path: currentPathURL + '/profile/:id',
        method: "get",
        handler: [
            common_middleware_1.checkAuthenticate,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const result = yield (0, controller_1.getProfileById)(req, next);
                    res.status(200).send(result);
                }
                catch (error) {
                    next(error);
                }
            }),
        ],
    },
];
//# sourceMappingURL=routes.js.map