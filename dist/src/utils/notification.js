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
exports.pushNotification = void 0;
const firebase_1 = __importDefault(require("./firebase"));
const pushNotification = (token, contentDetail, cb) => __awaiter(void 0, void 0, void 0, function* () {
    const message = {
        token: token,
        data: {
            title: `${contentDetail.title}`,
            body: `${contentDetail.message}`,
        },
        apns: {
            payload: {
                aps: {
                    contentAvailable: true,
                    sound: "alertsSound.wav",
                    badge: 1,
                    "mutable-content": 1,
                },
                my_custom_parameter: true,
            },
        },
    };
    const resp = yield firebase_1.default
        .messaging()
        .send(message);
    return cb(null, resp);
});
exports.pushNotification = pushNotification;
//# sourceMappingURL=notification.js.map