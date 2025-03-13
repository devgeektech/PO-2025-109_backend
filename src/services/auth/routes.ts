import { NextFunction, Request, Response } from "express";
import {
  createAdmin,
  login,
  logout,
  forgotPassword,
  changePassword,
  verifyResetLink,
  createNewPassword,
} from "./controller";
import config from "../../../config/default.json";
import {
  validate,
  checkForgotPassword,
  checkChangePassword,
  checkSignup
} from "./middleware/check";
import { checkAuthenticate } from "../../middleware/common.middleware";
import { registerUser } from "../../services/user/controller";
const basePath = config.BASE_PATH
const authPath= "auth/";
const currentPathURL = basePath + authPath;

export default [
  {
    path: currentPathURL + "/logout",
    method: "post",
    handler: [
      checkAuthenticate,
      async (req: Request, res: Response) => {
        const result = await logout(req.get(config.AUTHORIZATION));
        res.status(200).send(result);
      },
    ],
  },

  {
    path: currentPathURL + "/admin/forgotPassword",
    method: "post",
    handler: [
      checkForgotPassword,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await forgotPassword(req.body,next);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL + '/resetLink/:id',
    method: "get",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {

        const result = await verifyResetLink(req.params, req.query, next);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL + "/changePassword/:id",
    method: "post",
    handler: [
      checkChangePassword,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await changePassword(req.body, req.params.id);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL + "login",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await login(req,next);
        res.status(200).send(result);
      },
    ],
  },
  //  register  //
  {
    path: currentPathURL + "register",
    method: "post",
    handler: [
      checkSignup,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await registerUser(req,res, next);
        res.status(200).send(result);
      },
    ],
  },
  //change password
  {
    path: currentPathURL + '/changePassword',
    method: "post",
    handler: [
      checkAuthenticate,
      async (req: Request, res: Response) => {
        const result = await changePassword(req.get(config.AUTHORIZATION), req.body.currentPassword);
        res.status(200).send(result);
      }
    ]
  },
  //  forgot password  //
  {
    path: currentPathURL + 'forgotPassword',
    method: "post",
    handler: [
      checkForgotPassword,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await forgotPassword(req.body,next);
        res.status(200).send(result);
      }
    ]
  },
  {
    path: currentPathURL + 'resetPassword',
    method: "put",
    handler: [
      checkChangePassword,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await createNewPassword(req.body, next);
        res.status(200).send(result);
      },
    ],
  },
];
