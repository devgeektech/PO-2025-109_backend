"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const default_json_1 = __importDefault(require("../config/default.json"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
require("dotenv/config");
const utils_1 = require("./utils");
const middleware_1 = __importDefault(require("./middleware"));
const services_1 = __importDefault(require("./services"));
const errorHandlers_1 = __importDefault(require("./middleware/errorHandlers"));
const socket_1 = __importDefault(require("./socket/socket"));
const defaultCreate_1 = require("./middleware/defaultCreate");
const router = (0, express_1.default)();
router.set('views', path_1.default.join(__dirname, 'views'));
router.set("view engine", "ejs");
router.use(express_1.default.static("./public", { maxAge: "30d" }));
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/uploads/');
        },
        filename: (req, file, cb) => {
            let customFileName = Date.now();
            // get file extension from original file name
            let fileExtension = path_1.default.extname(file.originalname).split('.')[1];
            cb(null, customFileName + '.' + fileExtension);
        }
    }),
    limits: { fileSize: 1024 * 1024 * 500 }
});
router.use(upload.any());
(0, utils_1.applyMiddleware)(middleware_1.default, router);
(0, defaultCreate_1.defaultCreateMiddlewares)();
(0, utils_1.applyRoutes)(services_1.default, router);
(0, utils_1.applyMiddleware)(errorHandlers_1.default, router);
const PORT = process.env.PORT || 9001;
const server = http_1.default.createServer(router);
exports.server = server;
const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
exports.io = io;
mongoose_1.default
    .connect(`${default_json_1.default.MONGO_CRED.MONGO_PATH}/${default_json_1.default.MONGO_CRED.DATABASE}`)
    .then(() => {
    server.listen(PORT);
    (0, socket_1.default)(io);
    console.log(`Server is running http://localhost:${PORT}...`);
})
    .catch((error) => {
    console.log(`Server error: ${error}`);
});
//# sourceMappingURL=server.js.map