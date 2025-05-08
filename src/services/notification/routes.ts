import { NextFunction, Request, Response } from "express";
import config from "../../../config/default.json";
import { checkAuthenticate } from "../../middleware/common.middleware";
import { deleteNotification, getAllNotifications, getNotificationById, updateNotification, getAllNotificationsByUser, createBroadcastMessage } from "./controller";
const basePath = config.BASE_PATH;
const chatPath = "notification/";
const currentPathURL = basePath + chatPath;

export default [
  {
    path: currentPathURL,
    method: "post",
    handler: [
      // validateProperty,
      checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await createBroadcastMessage(req, res, next);
        res.status(200).send(result);
      },
    ]
  },
  {
    path: currentPathURL,
    method: "get",
    handler: [
      checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await getAllNotifications(req, next);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL + 'user/:id',
    method: "get",
    handler: [
      checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await getAllNotificationsByUser(req, next);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL + ":id",
    method: "get",
    handler: [
      checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await getNotificationById(req, res, next);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL + ":id",
    method: "put",
    handler: [
      checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await updateNotification(req, next);
        res.status(200).send(result);
      },
    ]
  },
  {
    path: currentPathURL + ":id",
    method: "delete",
    handler: [
      checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await deleteNotification(req, next);
        res.status(200).send(result);
      },
    ]
  },
];
