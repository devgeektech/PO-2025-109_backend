import { errorMessageHander } from "../../../utils/error-handler";
import { HTTP400Error } from "../../../utils/http-errors";
import { ResponseUtilities } from "../../../utils/response.util";
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateInquiry = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    phone: Joi.string().trim().required(),
    property: Joi.string().required(),
    query: Joi.string().trim().required(),
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

