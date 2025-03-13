import { NextFunction, Request, Response } from "express";
import {
  forgotPassword,
  loginUser,
  registerUser,
  verifyResetLink,
  registerPhone,
  verifyOtp,
  fetchUsers,
  updateUserStatus,
  googleAuth,
  facebookLogin,
  appleLogin,
  resendOTP,
  deleteAccount,
  updateNotificationPreference,
  updateProfile,
  getProfile,
  getProfileById,
  verifyGoogleAuth
} from "./controller";
import config from "../../../config/default.json";
import { checkAuthenticate } from "../../middleware/common.middleware";
import upload, { emailValidator, loginValidator, registerPhoneValidator, registerValidator, verifyOtpValidator } from "./check";

const basePath = config.BASE_PATH;
const currentPath = "user";
const currentPathURL = basePath+ currentPath;

export default [
  {
    path: currentPathURL + 'register',
    method: "post",
    handler: [
      registerValidator,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await registerUser(req, res, next);
        res.status(200).send(result);
      },
    ],
  },

  {
    path: currentPathURL + 'login',
    method: "post",
    handler: [loginValidator,
      async (req: Request, res: Response) => {
        const result = await loginUser(req, res);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL + "forgotPassword",
    method: "post",
    handler: [
      emailValidator,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await forgotPassword(req.body, next);
        res.status(200).send(result);
      },
    ],
  },


  // {
  //   path: currentPathURL + "verifyOtp",
  //   method: "post",
  //   handler: [
  //     registerPhoneValidator,
  //     async (req: Request, res: Response, next: NextFunction) => {
  //       const result = await registerPhone(req, res);
  //       res.status(200).send(result);
  //     },
  //   ],
  // },

  {
    path: currentPathURL + "registerPhone",
    method: "post",
    handler: [
      registerPhoneValidator,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await registerPhone(req, res);
        res.status(200).send(result);
      },
    ],
  },


  {
    path: currentPathURL + "/verifyOtpAndRegister",
    method: "post",
    handler: [
      verifyOtpValidator,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await verifyOtp(req, res);
        res.status(200).send(result);
      },
    ],
  },

  // {
  //   path: currentPathURL + "login/guest",
  //   method: "post",
  //   handler: [
  //     async (req: Request, res: Response, next: NextFunction) => {
  //       const result = await loginGuestUser(req, res);
  //       res.status(200).send(result);
  //     },
  //   ],
  // },

  {
    path: currentPathURL + 'user/:id/status',
    method: "put",
    handler: [checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await updateUserStatus(req, res,next);
        res.status(200).send(result);
      },
    ],
  },
  // router.put('/users/:id/status', authenticate, authorize('admin'), updateUserStatus);


  {
    path: currentPathURL + "/users",
    method: "get",
    handler: [checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await fetchUsers(req, res,next);
        res.status(200).send(result);
      },
    ],
  },

  {
    path: currentPathURL + 'validateOtpForgetPassword',
    method: "get",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {

        const result = await verifyResetLink(req.params, req.query, next);
        res.status(200).send(result);
      },
    ],
  },

  {
    path: currentPathURL + 'google-auth',
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await googleAuth(req, res);
        // /auth/google-verify
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL + 'verifyGoogleLogin',
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await verifyGoogleAuth(req, res);
        res.status(200).send(result);
      },
    ],
  },

  {
    path: currentPathURL + 'facebook-auth',
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {

        const result = await facebookLogin(req, res);
        res.status(200).send(result);
      },
    ],
  },

  {
    path: currentPathURL + 'apple-auth',
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await appleLogin(req, res);
        res.status(200).send(result);
      },
    ],
  },

  {
    path: currentPathURL + 'resend-Otp',
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await resendOTP(req, res);
        res.status(200).send(result);
      },
    ],
  },

  {
    path: currentPathURL + 'delete-account',
    method: "delete",
    handler: [checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await deleteAccount(req.get(config.AUTHORIZATION),req, res);
        res.status(200).send(result);
      },
    ],
  },

  {
    path: currentPathURL + 'notification-preference',
    method: "put",
    handler: [checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await updateNotificationPreference(req.get(config.AUTHORIZATION),req, res);
        res.status(200).send(result);
      },
    ],
  },


  {
    path: currentPathURL + '/update-profile',
    method: "put",
    handler: [
      checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await updateProfile(req.get(config.AUTHORIZATION),req, res);
        res.status(200).send(result);
      },
    ],
  },

  {
    path: currentPathURL + '/get-profile',
    method: "get",
    handler: [
      checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await getProfile(req.get(config.AUTHORIZATION), req, res);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: currentPathURL + '/profile/:id',
    method: "get",
    handler: [
      checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await getProfileById(req, next);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
];


