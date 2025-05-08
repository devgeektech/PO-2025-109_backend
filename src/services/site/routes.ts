import { NextFunction, Request, Response } from "express";
import config from "../../../config/default.json";
import {
  validateProperty
} from "./middleware/check";
import { checkAuthenticate } from "../../middleware/common.middleware";
import { addTeamMember, getSiteDetail, updateSiteDetail, updateTeamMember, } from "./controller";
const basePath = config.BASE_PATH;
const chatPath= "site/";
const currentPathURL = basePath + chatPath;

export default [
  {
    path: currentPathURL+'team',
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await addTeamMember(req,res,next);
        res.status(200).send(result);
      },
    ]
  },
  {
    path: currentPathURL,
    method: "get",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await getSiteDetail(req,res,next);
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
        const result = await updateSiteDetail(req,next);
        res.status(200).send(result);
      },
    ]
  },
  {
    path: currentPathURL+'team/:id',
    method: "put",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await updateTeamMember(req,res,next);
        res.status(200).send(result);
      },
    ]
  },
];
