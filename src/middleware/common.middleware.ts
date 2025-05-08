import { Request, Response, NextFunction } from "express";
import config from "../../config/default.json";
import { HTTP400Error, HTTP403Error } from "../utils/http-errors";
import { MESSAGES } from "../constants/messages";
import { JWTUtilities } from "../utils/jwt.util";

export const checkParamsHaveId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.params.id) {
    throw new HTTP400Error("Missing id params");
  } else {
    next();
  }
};

export const checkAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  const token: any = req.get(config.AUTHORIZATION);
  if(!token){
    throw new HTTP400Error({statusCode:401,message:MESSAGES.TOKEN_REQUIRED});
  }
  return JWTUtilities.verifyToken(token)
    .then((result) => {
      next();
    })
    .catch((error) => {
      throw new HTTP403Error({ statusCode: 403, message: error.message });
    });
};
