import { NextFunction, Request, Response } from "express";
import config from "../../../config/default.json";
import {
  validateProperty
} from "./middleware/check";
import { checkAuthenticate } from "../../middleware/common.middleware";
import { createNews, deleteNews, getAllNews, getNewsById, getNewsInsights, updateNews } from "./controller";
const basePath = config.BASE_PATH;
const chatPath= "news/";
const currentPathURL = basePath + chatPath;

export default [
  {
    path: currentPathURL,
    method: "post",
    handler: [
      // validateProperty,
      checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await createNews(req,res,next);
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
        const result = await getAllNews(req,next);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL+"insights",
    method: "get",
    handler: [
      checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await getNewsInsights(next);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL+":id",
    method: "get",
    handler: [
      checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await getNewsById(req,res,next);
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
        const result = await updateNews(req,next);
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
        const result = await deleteNews(req,next);
        res.status(200).send(result);
      },
    ]
  },
];
