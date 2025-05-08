import { NextFunction, Request, Response } from "express";
import config from "../../../config/default.json";
import {
  validateProperty
} from "./middleware/check";
import { checkAuthenticate } from "../../middleware/common.middleware";
import { createProperty, deleteProperty, deletePropertyImage, getAllProperties, getPropertyById, getRelatedProperties, updateProperty } from "./controller";
const basePath = config.BASE_PATH;
const chatPath= "property/";
const currentPathURL = basePath + chatPath;

export default [
  {
    path: currentPathURL,
    method: "post",
    handler: [
      // validateProperty,
      checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await createProperty(req,res,next);
        res.status(200).send(result);
      },
    ]
  },
  {
    path: currentPathURL,
    method: "get",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await getAllProperties(req,next);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL+ "related",
    method: "get",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await getRelatedProperties(req,next);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL+":id",
    method: "get",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await getPropertyById(req,res,next);
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
        const result = await updateProperty(req,next);
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
        const result = await deleteProperty(req,next);
        res.status(200).send(result);
      },
    ]
  },
  {
    path: currentPathURL + "image/:id",
    method: "delete",
    handler: [
      checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await deletePropertyImage(req,next);
        res.status(200).send(result);
      },
    ]
  },
];
