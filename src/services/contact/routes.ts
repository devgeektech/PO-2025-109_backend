import { NextFunction, Request, Response } from "express";
import config from "../../../config/default.json";
import {
  validateProperty
} from "./middleware/check";
import { checkAuthenticate } from "../../middleware/common.middleware";
import { createContact, deleteContact, getAllContacts, getContactById, updateContact } from "./controller";
const basePath = config.BASE_PATH;
const chatPath= "contact/";
const currentPathURL = basePath + chatPath;

export default [
  {
    path: currentPathURL,
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await createContact(req,res,next);
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
        const result = await getAllContacts(req,next);
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
        const result = await getContactById(req,res,next);
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
        const result = await updateContact(req,next);
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
        const result = await deleteContact(req,next);
        res.status(200).send(result);
      },
    ]
  },
];
