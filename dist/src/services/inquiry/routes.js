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
const default_json_1 = __importDefault(require("../../../config/default.json"));
const check_1 = require("./middleware/check");
const common_middleware_1 = require("../../middleware/common.middleware");
const controller_1 = require("./controller");
const basePath = default_json_1.default.BASE_PATH;
const chatPath = "inquiry/";
const currentPathURL = basePath + chatPath;
exports.default = [
    {
        path: currentPathURL,
        method: "post",
        handler: [
            check_1.validateInquiry,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.createInquiry)(req, next);
                res.status(200).send(result);
            }),
        ]
    },
    {
        path: currentPathURL,
        method: "get",
        handler: [
            common_middleware_1.checkAuthenticate,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.getAllInquiries)(req, next);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + ":id",
        method: "get",
        handler: [
            common_middleware_1.checkAuthenticate,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.getInquiryById)(req, next);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + ":id",
        method: "put",
        handler: [
            common_middleware_1.checkAuthenticate,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.updateInquiry)(req, next);
                res.status(200).send(result);
            }),
        ]
    },
    {
        path: currentPathURL + ":id",
        method: "delete",
        handler: [
            common_middleware_1.checkAuthenticate,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.deleteInquiry)(req, next);
                res.status(200).send(result);
            }),
        ]
    },
];
//# sourceMappingURL=routes.js.map