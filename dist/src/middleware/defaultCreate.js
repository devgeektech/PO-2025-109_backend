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
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCreateMiddlewares = void 0;
const controller_1 = require("../services/auth/controller");
const controller_2 = require("../services/site/controller");
const defaultCreateMiddlewares = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, controller_1.createAdmin)();
        yield (0, controller_2.setupSite)();
    }
    catch (error) { }
});
exports.defaultCreateMiddlewares = defaultCreateMiddlewares;
//# sourceMappingURL=defaultCreate.js.map