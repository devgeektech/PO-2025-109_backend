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
const check_1 = require("./middleware/check");
const common_middleware_1 = require("../../middleware/common.middleware");
const controller_2 = require("../../services/user/controller");
const basePath = default_json_1.default.BASE_PATH;
const authPath = "auth/";
const currentPathURL = basePath + authPath;
exports.default = [
    {
        path: currentPathURL + "/logout",
        method: "post",
        handler: [
            common_middleware_1.checkAuthenticate,
            (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.logout)(req.get(default_json_1.default.AUTHORIZATION));
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + "/admin/forgotPassword",
        method: "post",
        handler: [
            check_1.checkForgotPassword,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.forgotPassword)(req.body, next);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + '/resetLink/:id',
        method: "get",
        handler: [
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.verifyResetLink)(req.params, req.query, next);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + "/changePassword/:id",
        method: "post",
        handler: [
            check_1.checkChangePassword,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.changePassword)(req.body, req.params.id);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + "login",
        method: "post",
        handler: [
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.login)(req, next);
                res.status(200).send(result);
            }),
        ],
    },
    //  register  //
    {
        path: currentPathURL + "register",
        method: "post",
        handler: [
            check_1.checkSignup,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_2.registerUser)(req, res, next);
                res.status(200).send(result);
            }),
        ],
    },
    //change password
    {
        path: currentPathURL + '/changePassword',
        method: "post",
        handler: [
            common_middleware_1.checkAuthenticate,
            (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.changePassword)(req.get(default_json_1.default.AUTHORIZATION), req.body.currentPassword);
                res.status(200).send(result);
            })
        ]
    },
    //  forgot password  //
    {
        path: currentPathURL + 'forgotPassword',
        method: "post",
        handler: [
            check_1.checkForgotPassword,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.forgotPassword)(req.body, next);
                res.status(200).send(result);
            })
        ]
    },
    {
        path: currentPathURL + 'resetPassword',
        method: "put",
        handler: [
            check_1.checkChangePassword,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.createNewPassword)(req.body, next);
                res.status(200).send(result);
            }),
        ],
    },
];
//# sourceMappingURL=routes.js.map