import http from "http";
import express from "express";
import mongoose from "mongoose";
import config from "../config/default.json";
import multer from "multer";
import path from "path";
import { Server } from "socket.io";
import 'dotenv/config';
import { applyMiddleware, applyRoutes } from "./utils";
import middleware from "./middleware";
import routes from "./services";
import errorHandlers from "./middleware/errorHandlers";
import socketHandler from "./socket/socket";
import { defaultCreateMiddlewares } from "./middleware/defaultCreate";

const router = express();

router.set('views', path.join(__dirname, 'views'));
router.set("view engine", "ejs");

router.use(express.static("./public", {maxAge:"30d"}));

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/uploads/')
        },
        filename: (req, file, cb) => {
            let customFileName =Date.now();
            // get file extension from original file name
            let fileExtension = path.extname(file.originalname).split('.')[1];
            cb(null, customFileName + '.' + fileExtension)
        }
      }),
      limits: { fileSize: 1024 * 1024 * 500 }
})


router.use(upload.any());
applyMiddleware(middleware, router);
defaultCreateMiddlewares()
applyRoutes(routes, router);
applyMiddleware(errorHandlers, router);

const PORT = process.env.PORT || 9001;
const server = http.createServer(router);

const io = new Server(server, { cors: { origin: "*" } });

mongoose
  .connect(`${config.MONGO_CRED.MONGO_PATH}/${config.MONGO_CRED.DATABASE}`)
  .then(() => {
    server.listen(PORT);
    socketHandler(io);
    console.log(`Server is running http://localhost:${PORT}...`);
  })
  .catch((error) => {
    console.log(`Server error: ${error}`);
  });

export {server, io};
