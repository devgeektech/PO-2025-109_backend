"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUILDING_STATUS = exports.ADMIN_USERS = exports.ADMIN_EMAIL = exports.ADMIN = void 0;
exports.ADMIN = "admin";
exports.ADMIN_EMAIL = "admin@gmail.com";
exports.ADMIN_USERS = [
    {
        fullName: "Admin",
        email: "admin@gmail.com",
        password: "Qwerty@123",
        isDeleted: false,
        role: exports.ADMIN,
        authProvider: "email",
        otpVerified: true
    }
];
exports.BUILDING_STATUS = [
    'existing', 'completed'
];
//# sourceMappingURL=index.js.map