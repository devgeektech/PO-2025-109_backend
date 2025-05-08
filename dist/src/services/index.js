"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("./auth/routes"));
const routes_2 = __importDefault(require("./user/routes"));
const routes_3 = __importDefault(require("./property/routes"));
const routes_4 = __importDefault(require("./notification/routes"));
const routes_5 = __importDefault(require("./contact/routes"));
const routes_6 = __importDefault(require("./inquiry/routes"));
const routes_7 = __importDefault(require("./site/routes"));
const routes_8 = __importDefault(require("./news/routes"));
exports.default = [
    ...routes_1.default,
    ...routes_2.default,
    ...routes_3.default,
    ...routes_4.default,
    ...routes_5.default,
    ...routes_6.default,
    ...routes_7.default,
    ...routes_8.default,
];
//# sourceMappingURL=index.js.map