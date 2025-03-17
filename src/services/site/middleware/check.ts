import { MESSAGES } from "../../../constants/messages";
import { errorMessageHander } from "../../../utils/error-handler";
import { HTTP400Error } from "../../../utils/http-errors";
import { ResponseUtilities } from "../../../utils/response.util";
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateProperty = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().trim().required(),
    address: Joi.string().trim().required(),
    propertyType: Joi.string().valid("house", "villa", "apartment").required(),
    description: Joi.string().trim().required(),
    propertySize: Joi.number().positive().required(),
    bedrooms: Joi.number().integer().min(1).required(),
    bathrooms: Joi.number().integer().min(1).required(),
    coordinate: Joi.object({
      latitude: Joi.number(),
      longitude: Joi.number(),
    }),
    facilities: Joi.object({
      carParking: Joi.boolean(),
      swimming: Joi.boolean(),
      gymAndFit: Joi.boolean(),
      restaurant: Joi.boolean(),
      wifi: Joi.boolean(),
      petCenter: Joi.boolean(),
      sportsClub: Joi.boolean(),
      laundry: Joi.boolean(),
    }),
    price: Joi.number().positive().required(),
    images: Joi.array().items(Joi.string())
  });
  console.log(req.body)
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

