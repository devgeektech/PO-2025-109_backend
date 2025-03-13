import { MESSAGES } from "../../../constants/messages";
import { errorMessageHander } from "../../../utils/error-handler";
import { HTTP400Error } from "../../../utils/http-errors";
import { ResponseUtilities } from "../../../utils/response.util";
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateBroadcast = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    title: Joi.string().trim().required(),
    isBroadcast: Joi.bool(),
    description: Joi.string().trim().required(),
  });
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const messageArr = errorMessageHander(error.details);
    throw new HTTP400Error(
      ResponseUtilities.sendResponsData({
        code: 400,
        message: messageArr[0],
      })
    );
  } else {
    req.body = value;
    next();
  }
};

