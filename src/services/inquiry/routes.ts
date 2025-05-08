import { NextFunction, Request, Response } from "express";
import config from "../../../config/default.json";
import {
  validateInquiry
} from "./middleware/check";
import { checkAuthenticate } from "../../middleware/common.middleware";
import { createInquiry, deleteInquiry, getAllInquiries, getInquiryById, updateInquiry} from "./controller";
const basePath = config.BASE_PATH;
const chatPath= "inquiry/";
const currentPathURL = basePath + chatPath;

export default [
  {
    path: currentPathURL,
    method: "post",
    handler: [
      validateInquiry,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await createInquiry(req,next);
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
        const result = await getAllInquiries(req,next);
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
        const result = await getInquiryById(req,next);
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
        const result = await updateInquiry(req,next);
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
        const result = await deleteInquiry(req,next);
        res.status(200).send(result);
      },
    ]
  },
];
