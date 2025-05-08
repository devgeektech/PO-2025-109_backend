import config from "../../../config/default.json";
var mongoose = require("mongoose");
import moment from "moment";
import ejs from "ejs";
import { NextFunction } from "express";
import Users from "../../models/Users";
import { HTTP400Error } from "../../utils/http-errors";
import { ResponseUtilities } from "../../utils/response.util";
import { JWTUtilities } from "../../utils/jwt.util";
import { BcryptUtilities } from "../../utils/bcrypt.util";
import { ADMIN, ADMIN_EMAIL, ADMIN_USERS } from "../../constants/index";
import { MESSAGES } from "../../constants/messages";
import { generateOTP } from "../../utils";
import { MailerUtilities } from "../../utils/MailerUtilities";

//  Create admin if no admin exist in database  //
export const createAdmin = async () => {
  let userRes: any = await Users.findOne({ email: ADMIN_EMAIL, isDeleted: false });
  if (!userRes) {
    const adminArr:any = ADMIN_USERS;
    console.log('Admin created successfully.')
    return await Users.create(adminArr);
  } else {
    userRes.role = ADMIN;
    return await userRes.save();
  }
};

export const login = async (req: any, next: any) => {
  try {
    const { email, password, deviceToken } = req.body;
    const user:any = await Users.findOne({ email: email, isDeleted: false });
    if (!user) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.USER_ERRORS.USER_NOT_EXIST,
        })
      );
    }
    const passwordMatch = await BcryptUtilities.VerifyPassword(password, user.password);
    if (!passwordMatch) {
      console.log(password, user.password,passwordMatch)
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.USER_ERRORS.INVALID_PASSWORD,
        })
      );
    }
    if (!user.otpVerified) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.USER_ERRORS.USER_ACCOUNT_NOT_VERIFIED,
        })
      );
    }
    let userToken = await JWTUtilities.createJWTToken({
      id: user._id,
      email: user.email,
      name: user.name,
      role:user.role
    });
    user.accessToken = userToken;
    user.deviceToken = deviceToken;
    await user.save();

    let result = {
      userDetail: user,
      token: userToken
    };


    return ResponseUtilities.sendResponsData({ code: 200, message: 'Success', data: result });

  } catch (error) {
    next(error);
  }
};

export const logout = async (token: any) => {
  const decoded: any = await JWTUtilities.getDecoded(token);

  let userRes: any = await Users.findOne({
    _id: mongoose.Types.ObjectId(decoded.id),
    isDeleted: false
  });
  if (userRes) {
    userRes.accessToken = "";
    await userRes.save();
    return ResponseUtilities.sendResponsData({ code: 200, message: "Success" });
  } else {
    throw new HTTP400Error(
      ResponseUtilities.sendResponsData({
        code: 400,
        message: MESSAGES.USER_ERRORS.USER_NOT_EXIST,
      })
    );
  }
};

export const forgotPassword = async (body: any,next:any) => {
  let userRes: any = await Users.findOne({ email: body.email, isDeleted: false });
  if (userRes) {
    let randomOTP = generateOTP()

    // let forgotPasswordLink = `http://localhost:3001/auth/change-password?id=${userRes._id.toString()}&otp=${randomOTP}`;

    // userRes.forgotPasswordLink = forgotPasswordLink;
    userRes.linkVerified = false;
    userRes.linkExipredAt = moment().add(5, 'm')

    let message = await ejs.renderFile(process.cwd() + "/src/views/forgotPasswordEmail.ejs", { otp: randomOTP }, { async: true });
    let mailResponse = await MailerUtilities.sendSendgridMail({ recipient_email: [body.email], subject: "Forgot Password", text: message });
    userRes['otp'] = randomOTP;
    userRes['otpVerified'] = false;
    userRes['otpExipredAt'] = moment().add(10, "m");

    await userRes.save();
    return ResponseUtilities.sendResponsData({ statusCode: 200, message: MESSAGES.MAIL_SENT });
  } else {
    return ResponseUtilities.sendResponsData({
      statusCode: 404, message: MESSAGES.USER_CANNOT_BE_FOUND
    })
  }
}

export const verifyResetLink = async (params: any, query: any, next: NextFunction) => {
  try {
    let user:any = await Users.findById(params.id);
    if (!user) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.LINK_ERRORS.INVALID_LINK
        })
      );
    }

    console.log(user.otp != query.otp)

    if (user.otp != query.otp) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.LINK_ERRORS.INVALID_LINK
        })
      );
    }
    if (moment().isAfter(moment(user.otpExipredAt))) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.LINK_ERRORS.INVALID_LINK
        })
      );
    }

    user.otp = 0;
    user.otpVerified = true;
    await user.save();
    return ResponseUtilities.sendResponsData({
      code: 200,
      message:'The link has been verified successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
}


//  Change password  //
export const changePassword = async (bodyData: any, adminId: string) => {
  let userRes: any = await Users.findOne({ _id: mongoose.Types.ObjectId(adminId), isDeleted: false });

  if (userRes) {
    userRes.password = bodyData.password;
    userRes.save();
    return ResponseUtilities.sendResponsData({ code: 200, message: 'Success', data: userRes });

  } else {
    throw new HTTP400Error(ResponseUtilities.sendResponsData({ code: 400, message: MESSAGES.USER_ERRORS.INVALID_LOGIN}));
  }
};



export const createNewPassword = async (body: any, next: any) => {
  try {
    const { otp } = body;
    let userRes: any = await Users.findOne({
      email: body.email,
      isDeleted: false,
    });
    if (userRes) {
      // let messageHtml = await ejs.renderFile(
      //   process.cwd() + "/src/views/changePassword.email.ejs",
      //   { name: userRes.firstName.charAt(0).toUpperCase() + userRes.firstName.slice(1) },
      //   { async: true }
      // );
      // let mailResponse = await MailerUtilities.sendSendgridMail({ recipient_email: [body.email], subject: "Forgot Password", text: message });
      // let mailData = await MailerUtilities.sendSendgridMail(userRes.email, '', messageHtml, "Change Password");
      // let mailResponse = await MailerUtilities.sendSendgridMail({ recipient_email: [body.email], subject: "Change", text: messageHtml });

      if (userRes.otp !== otp) {
        return ResponseUtilities.sendResponsData({
          statusCode: 400,
          message: MESSAGES.INVALID_OTP
        });
      }

      if (new Date() > userRes.otpExpiresAt) {
        return ResponseUtilities.sendResponsData({
          statusCode: 400,
          message: MESSAGES.EXPIRED_OTP
        });
      }

      userRes.otpVerified = true;
      userRes.otp = '';
      userRes.otpExpiresAt = undefined;

      userRes.password = body.password;
      await userRes.save();
      return ResponseUtilities.sendResponsData({
        code: 200,
        message: MESSAGES.USER_ERRORS.PASSWORD_UPDATED,
        data: userRes
      });
    } else {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.USER_ERRORS.USER_NOT_EXIST,
        })
      );
    }
  } catch (error) {
    next(error)
  }
};
