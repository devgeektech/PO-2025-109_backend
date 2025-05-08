import { errorMessageHander } from "../../../utils/error-handler";
import { HTTP400Error } from "../../../utils/http-errors";
import { ResponseUtilities } from "../../../utils/response.util";
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().trim(true).required().messages({
      "string.empty": "Email can not be empty",
      "string.email": `Email should be a valid email`
    }),
    password: Joi.string().trim(true).required().messages({ "string.empty": "Password can not be empty" }),
    role: Joi.string().optional(),
  });
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    let messageArr = errorMessageHander(error.details);
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

export const checkForgotPassword = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().trim(true).required().messages({
      "string.empty": "Email can not be empty",
      "string.email": "Email should be a valid email"
    })
  });
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    let messageArr = errorMessageHander(error.details);
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

export const checkChangePassword = (req: Request, res: Response, next: NextFunction) => {
  // Password must include atleast 8 characters including 1 number and 1 special character
  const schema = Joi.object({
    password: Joi.string().trim(true).required().messages({ "string.empty": "Password can not be empty" }),
    email: Joi.string().email().trim(true).required().messages({
      "string.empty": "Email can not be empty",
      "string.email": "Email should be a valid email"
    }),
    otp: Joi.string().trim(true).required().messages({
      "string.empty": "OTP can not be empty"
    })
  });
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    let messageArr = errorMessageHander(error.details);
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


export const checkSignup = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    fullName: Joi.string().trim(true).required().messages({
      "string.empty": "Full Name can not be empty",
    }),
    email: Joi.string().email().trim(true).required().messages({
      "string.empty": "Email can not be empty",
      "string.email": "Email should be a valid email"
    }),
    password: Joi.string().min(6).trim(true).required().messages({
       "string.empty": "Password can not be empty",
    }),
    authProvider: Joi.string().trim()
  });
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    let messageArr = errorMessageHander(error.details);
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


export const checkOTP = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Password must include atleast 8 characters including 1 number and 1 special character
  const schema = Joi.object({
    email: Joi.string().email().trim(true).required().messages({
      "string.empty": "Email can not be empty",
      "string.email": "Email should be a valid email"
    }),
    otp: Joi.string().trim(true).required().messages({
      "string.empty": "OTP can not be empty"
    })
  });
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    let messageArr = errorMessageHander(error.details);
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

export const checkPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Password must include atleast 8 characters including 1 number and 1 special character
  const schema = Joi.object({
    email: Joi.string().email().trim(true).required().messages({
      "string.empty": "Email can not be empty",
      "string.email": "Email should be a valid email"
    }),
    password: Joi.string()
      .trim(true)
      .min(8)
      .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
      .required()
      .messages({
        "string.empty": "Password can not be empty",
        "string.min": "Password must include atleast 8 characters",
        "string.pattern.base": "Password must include atleast 1 number and 1 special character"
      })
  });
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    let messageArr = errorMessageHander(error.details);
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

export const checkResendOTP = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Password must include atleast 8 characters including 1 number and 1 special character
  const schema = Joi.object({
    email: Joi.string().email().trim(true).required().messages({
      "string.empty": "Email can not be empty",
      "string.email": "Email should be a valid email"
    })
  });
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    let messageArr = errorMessageHander(error.details);
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
