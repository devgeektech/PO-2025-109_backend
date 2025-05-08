"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = exports.applyRoutes = exports.applyMiddleware = void 0;
const applyMiddleware = (middlewareWrappers, router) => {
    for (const wrapper of middlewareWrappers) {
        wrapper(router);
    }
};
exports.applyMiddleware = applyMiddleware;
const applyRoutes = (routes, router) => {
    for (const route of routes) {
        const { method, path, handler } = route;
        router[method](path, handler);
    }
};
exports.applyRoutes = applyRoutes;
const generateOTP = (length = 6) => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
//# sourceMappingURL=index.js.map