import { NextFunction, Request, Response } from 'express';

import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import ejs from "ejs";
const generateOTP = (length = 6): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
import admin from '../../utils/firebase';
import { ResponseUtilities } from '../../utils/response.util';
import { MESSAGES } from '../../constants/messages';
import Users from '../../models/Users';
import { JWTUtilities } from '../../utils/jwt.util';
import { MailerUtilities } from '../../utils/MailerUtilities';
import jwt from "jsonwebtoken";
import { BcryptUtilities } from '../../utils/bcrypt.util';
export const googleAuth = async (req: Request, res: Response) => {

  try {
    const { idToken } = req.body;
    if (!idToken) {
      return ResponseUtilities.sendResponsData({
        statusCode: 400,
        message: MESSAGES.TOKEN_REQUIRED,
      });
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, uid } = decodedToken;

    if (!email) {
      return ResponseUtilities.sendResponsData({
        statusCode: 400,
        message: MESSAGES.EMAIL_REQUIRED_MESSAGE,
      });
    }

    let user: any = await Users.findOne({ email });

    if (!user) {
      user = new Users({
        fullName: name,
        email,
        authProvider: 'google',
        isGuest: false,
        role: 'user',
        googleUid: uid
      });

      await user.save();
    }

    const token = JWTUtilities.generateToken(user._id, email);
    user.accessToken = token

    return ResponseUtilities.sendResponsData({
      statusCode: 200,
      message: MESSAGES.LOGIN_SUCCESSFUL,
      data: user
    });


  } catch (error: any) {
    let errorMessage = null
    let statusCode
    if (error.errorInfo.code === 'auth/id-token-expired') {
      statusCode = 400
      errorMessage = MESSAGES.FIREBASE_TOKEN_EXPIRED
    }
    return ResponseUtilities.sendResponsData({
      statusCode: statusCode || 500,
      message: errorMessage || MESSAGES.INTERNAL_SERVER_ERROR
    });
  }
};

export const fetchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const searchTerm = req.query.search as string || '';

    const searchQuery = {
      isDeleted: false,
      role: 'user',
      $or: [
        { email: { $regex: searchTerm, $options: 'i' } },
        { phoneNumber: { $regex: searchTerm, $options: 'i' } }
      ]
    };

    const skip = (page - 1) * limit;

    const users = await Users.find(searchQuery)
      .skip(skip)
      .limit(limit);

    const totalUsers = await Users.countDocuments({
      isDeleted: false,
      role: 'user',
    });


    const totalPages = Math.ceil(totalUsers / limit);

    return ResponseUtilities.sendResponsData({
      statusCode: 200,
      message: MESSAGES.USERS_FETCHED_SUCCESSFULLY,
      data: users,
      pagination: {
        totalPages,
        currentPage: page,
        limit,
        totalRecords: totalUsers
      },
    });

  } catch (error) {
    next(error);
  }
};



export const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    if (typeof isBlocked !== 'boolean') {

      return ResponseUtilities.sendResponsData({
        statusCode: 400,
        message: MESSAGES.INVALID_INPUT
      });
    }

    const user = await Users.findById(id);
    if (!user || user.isDeleted) {

      return ResponseUtilities.sendResponsData({
        statusCode: 400,
        message: MESSAGES.USER_CANNOT_BE_FOUND
      });
    }

    user.isBlocked = isBlocked;
    await user.save();

    const statusMessage = isBlocked ? MESSAGES.USER_STATUS_UPDATED.deactivated : MESSAGES.USER_STATUS_UPDATED.activated;

    return ResponseUtilities.sendResponsData({
      statusCode: 200,
      message: statusMessage,
      data: { userId: user._id, isBlocked: user.isBlocked },
    });

  } catch (error) {
    next(error);
  }
};


export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body)
  const { fullName, email, phoneNumber, password, authProvider, deviceToken } = req.body;

  try {
    if (!authProvider) {
      return ResponseUtilities.sendResponsData({
        statusCode: 400,
        message: MESSAGES.AUTH_PROVIDER_REQUIRED,
      });
    }

    if (authProvider === "email") {
      if (!email || !password) {
        return ResponseUtilities.sendResponsData({
          statusCode: 400,
          message: MESSAGES.EMAIL_PASSWORD_REQUIRED,
        });
      }

      // Check if user already exists with the given email or phone number
      const existingUser = await Users.findOne({
        $or: [{ email }],
      });

      if (existingUser) {
        return ResponseUtilities.sendResponsData({
          statusCode: 400,
          message: MESSAGES.USER_ALREADY_EXISTS,
        });
      }

      const otp = generateOTP();
      const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

      const newUser = new Users({
        fullName,
        email,
        phoneNumber,
        password,
        authProvider,
        otp,
        otpExpiredAt: otpExpiration,
        deviceToken
      });

      await newUser.save();

      const message = await ejs.renderFile(
        process.cwd() + "/src/views/forgotPasswordEmail.ejs",
        { otp },
        { async: true }
      );

      await MailerUtilities.sendSendgridMail({
        recipient_email: [email],
        subject: "Registration Verification",
        text: message,
      });

      return ResponseUtilities.sendResponsData({
        statusCode: 200,
        message: MESSAGES.OTP_SENT,
        data: {
          phoneNumber: newUser.phoneNumber,
          otpExpiredAt: otpExpiration,
          otp,
        },
      });
    } else {
      return ResponseUtilities.sendResponsData({
        statusCode: 400,
        message: MESSAGES.INVALID_AUTH_PROVIDER, // Handle unknown auth providers
      });
    }
  } catch (error) {
    console.error("Server error during registration:", error);
    return ResponseUtilities.sendResponsData({
      statusCode: 500,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  const { email, phoneNumber, password, authProvider }: { email?: string; phoneNumber?: string; password: string, authProvider: string } = req.body;

  try {
    let user: any;
    if (authProvider === 'guest') {
      const sessionId = uuidv4();
      const guestSessionExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24-hour session
      const accessToken = JWTUtilities.generateGuestToken(sessionId, '24h'); // 24-hour guest session
      return ResponseUtilities.sendResponsData({
        statusCode: 200,
        message: MESSAGES.REGISTRATION_SUCCESSFUL,
        data: {
          sessionId,
          accessToken,
          guestSessionExpiredAt: guestSessionExpiration,
        },
      });
    }


    if (phoneNumber) {
      user = await Users.findOne({ phoneNumber });

      if (user && user?.otpVerified === false) {
        return ResponseUtilities.sendResponsData({
          statusCode: 401,
          message: MESSAGES.USER_NOT_VERIFIED,
        });
      }

      const otp = generateOTP();
      const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 min

      if (!user) {
        user = new Users({
          phoneNumber,
          otp,
          otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
          otpVerified: false,
          authProvider: 'phone',
          role: 'user',
        });
      }



      user.otp = otp;
      user.otpExpiresAt = otpExpiration
      await user.save();
      return ResponseUtilities.sendResponsData({
        statusCode: 200,
        message: MESSAGES.OTP_SENT,
        data: {
          phoneNumber: user.phoneNumber,
          otpExpiredAt: otpExpiration,
          otp
        },
      });

    }
    if (email) {
      user = await Users.findOne({ email });

      if (!user) {
        return ResponseUtilities.sendResponsData({
          statusCode: 400,
          message: MESSAGES.USER_CANNOT_BE_FOUND,
        });
      }

      if (user && user?.otpVerified === false) {
        return ResponseUtilities.sendResponsData({
          statusCode: 401,
          message: MESSAGES.USER_NOT_VERIFIED,
        });
      }

      const enteredPasswordTrimmed = password.trim();
      const hashedPasswordFromDB = user.password.trim();

      const isMatch = await BcryptUtilities.VerifyPassword(enteredPasswordTrimmed, hashedPasswordFromDB);

      if (!isMatch) {
        return ResponseUtilities.sendResponsData({
          statusCode: 401,
          message: MESSAGES.INVALID_CREDENTIALS,
        });
      }


      const token = JWTUtilities.generateToken(user._id, email);
      user.accessToken = token;
      await user.save();

      return ResponseUtilities.sendResponsData({
        statusCode: 200,
        message: MESSAGES.LOGIN_SUCCESSFUL,
        data: {
          _id: user._id,
          email: user.email,
          phoneNumber: user.phoneNumber,
          accessToken: token,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        },
      });
    }
  } catch (error) {
    return ResponseUtilities.sendResponsData({
      statusCode: 500,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const forgotPassword = async (body: any, next: any) => {
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
    const { email, otp } = query;
    const user: any = await Users.findOne({ email: email.toString().toLowerCase(), isDeleted: false }).lean();

    if (!user) {
      return ResponseUtilities.sendResponsData({
        statusCode: 400,
        message: MESSAGES.INVALID_LINK
      })
    }

    let trimmedOtp = otp.trim()
    let userOtpTrimmed = user.otp.trim();
    console.log(user.otp != otp)
    if (trimmedOtp != userOtpTrimmed) {
      return ResponseUtilities.sendResponsData({
        statusCode: 400,
        message: MESSAGES.INVALID_LINK
      })

    }
    if (moment().isAfter(moment(user.otpExipredAt))) {
      return ResponseUtilities.sendResponsData({
        statusCode: 400,
        message: MESSAGES.INVALID_LINK
      })
    }

    await Users.updateOne(
      { email: email.toString().toLowerCase() },
      { $set: { otp: "", otpVerified: true } }
    );
    // await user.save();
    return ResponseUtilities.sendResponsData({
      codeStatus: 200,
      message: MESSAGES.LINK_VERIFIED,
    });
  } catch (error) {
    next(error);
  }
}


export const verifyOtp = async (req: Request, res: Response) => {

  const { email, otp } = req.body;
  try {
    const user: any = await Users.findOne({ email });
    console.log('dfsaasd', user)
    if (!user) {
      return ResponseUtilities.sendResponsData({
        statusCode: 400,
        message: MESSAGES.OTP_VERIFICATION_FAILED
      });
    }



    if (user.otp !== otp) {
      return ResponseUtilities.sendResponsData({
        statusCode: 400,
        message: MESSAGES.INVALID_OTP
      });
    }

    if (new Date() > user.otpExpiresAt) {
      return ResponseUtilities.sendResponsData({
        statusCode: 400,
        message: MESSAGES.EXPIRED_OTP
      });
    }

    user.otpVerified = true;
    user.otp = '';
    user.otpExpiresAt = undefined;
    await user.save();

    // const token = generateToken(savedUser._id.toString(), savedUser.email || savedUser.phoneNumber);

    const token = JWTUtilities.generateToken(user._id.toString(), 'email', '1h', user.email);
    return ResponseUtilities.sendResponsData({
      statusCode: 200,
      message: MESSAGES.LOGIN_SUCCESSFUL,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        accessToken: token,

      },
    });
  } catch (error) {
    console.log(error)
    return ResponseUtilities.sendResponsData({
      statusCode: 500,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};



export const facebookLogin = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return ResponseUtilities.sendResponsData({
        statusCode: 400,
        message: MESSAGES.TOKEN_REQUIRED,
      });
    }

    const decodedToken: any = await admin.auth().verifyIdToken(idToken);
    console.log(decodedToken)

    if (!decodedToken || !decodedToken.uid) {
      return ResponseUtilities.sendResponsData({
        statusCode: 400,
        message: MESSAGES.INVALID_TOKEN,
      });
    }

    const { uid, email, name } = decodedToken;

    // if (sign_in_provider !== 'facebook.com') {
    //   return res.status(401).json({ message: 'Invalid Provider' });
    // }

    let user = await Users.findOne(email);

    if (!user) {
      user = new Users({
        fullName: name,
        email: email,
        authProvider: 'facebook',
        facebookUid: uid,
        isGuest: false,
      });

      await user.save();

      return ResponseUtilities.sendResponsData({
        statusCode: 200,
        message: MESSAGES.LOGIN_SUCCESSFUL,
        data: user
      });
    } else {
      return ResponseUtilities.sendResponsData({
        statusCode: 200,
        message: MESSAGES.EMAIL_ALREADY_EXIST,
      });
    }


  } catch (error) {
    console.error('Facebook login error:', error);
    return ResponseUtilities.sendResponsData({
      statusCode: 500,
      message: MESSAGES.INTERNAL_SERVER_ERROR
    });
  }
};

export const appleLogin = async (req: Request, res: Response) => {
  try {
    const { idToken, fullName } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "idToken is required" });
    }

    const decodedToken: any = await admin.auth().verifyIdToken(idToken);

    if (!decodedToken) {
      return ResponseUtilities.sendResponsData({
        statusCode: 400,
        message: MESSAGES.TOKEN_REQUIRED,
      });
    }

    const { uid, email } = decodedToken;

    let user = await Users.findOne(email);
    // let user = await Users.findOne({ appleUid: uid });

    if (!user) {
      user = new Users({
        fullName: fullName || "",
        email,
        authProvider: "apple",
        appleUid: uid,
        isGuest: false,
        role: "user",
      });
      await user.save();
    }

    // Generate a JWT token for session management
    // const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret", {
    //   expiresIn: "7d",
    // });

    return ResponseUtilities.sendResponsData({
      statusCode: 200,
      message: MESSAGES.LOGIN_SUCCESSFUL,
      data: user
    });

  } catch (error) {
    console.error("Apple Login Error:", error);
    return ResponseUtilities.sendResponsData({
      statusCode: 500,
      message: MESSAGES.INTERNAL_SERVER_ERROR
    });
  }
};



export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!phoneNumber) {
      return ResponseUtilities.sendResponsData({
        statusCode: 400,
        message: MESSAGES.EMAIL_OR_PHONE_REQUIRED,
      });
    }

    // const user:any = await Users.findOne({
    //   $or: [{ email }, { phoneNumber }],
    // });

    let user: any = await Users.findOne({ phoneNumber });

    if (!user) {
      return ResponseUtilities.sendResponsData({
        statusCode: 404,
        message: MESSAGES.USER_CANNOT_BE_FOUND
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();


    if (user.email) {

      const message = await ejs.renderFile(
        process.cwd() + "/src/views/forgotPasswordEmail.ejs",
        { otp },
        { async: true }
      );

      await MailerUtilities.sendSendgridMail({
        recipient_email: [user.email],
        subject: "Registration Verification",
        text: message,
      });

    }


    return ResponseUtilities.sendResponsData({
      statusCode: 200,
      message: MESSAGES.OTP_SENT,
      otp: otp

    });
  } catch (error) {

    console.error("Error resending OTP:", error);
    return ResponseUtilities.sendResponsData({
      statusCode: 500,
      message: MESSAGES.INTERNAL_SERVER_ERROR
    });
  }
};


export const deleteAccount = async (token: any, req: Request, res: Response) => {
  const decoded: any = await JWTUtilities.getDecoded(token);

  try {
    const user = await Users.findById(decoded._id);
    console.log(user)
    if (!user) {
      return ResponseUtilities.sendResponsData({
        statusCode: 404,
        message: MESSAGES.USER_CANNOT_BE_FOUND
      });


    }
    await Users.findByIdAndDelete(user.id);
    return ResponseUtilities.sendResponsData({
      statusCode: 200,
      message: MESSAGES.ACCOUNT_DELETED_SUCCESSFULLY
    });

  } catch (error) {
    return ResponseUtilities.sendResponsData({
      statusCode: 500,
      message: MESSAGES.INTERNAL_SERVER_ERROR
    });

  }
};

export const updateNotificationPreference = async (token: any, req: Request, res: Response) => {
  const decoded: any = await JWTUtilities.getDecoded(token);
  try {
    const user = await Users.findById(decoded._id);
    if (!user) {

      return ResponseUtilities.sendResponsData({
        statusCode: 404,
        message: MESSAGES.USER_CANNOT_BE_FOUND
      });
    }

    const { notificationsEnabled } = req.body;

    if (typeof notificationsEnabled !== 'boolean') {
      return ResponseUtilities.sendResponsData({
        statusCode: 400,
        message: MESSAGES.INVALID_NOTIFICATIONS_ENABLED
      });
    }
    user.notificationsEnabled = notificationsEnabled;
    await user.save();

    return ResponseUtilities.sendResponsData({
      statusCode: 200,
      message: MESSAGES.NOTIFICATION_SETTINGS_UPDATED
    });

  } catch (error) {
    return ResponseUtilities.sendResponsData({
      statusCode: 500,
      message: MESSAGES.INTERNAL_SERVER_ERROR
    });
  }
};




export const updateProfile = async (token: any, req: Request, res: Response) => {

  try {
    if (!token) {
      return ResponseUtilities.sendResponsData({
        statusCode: 401,
        message: MESSAGES.TOKEN_REQUIRED
      });
    }
    const decoded: any = await JWTUtilities.getDecoded(token);
    const { fullName, about } = req.body;
    const userId = decoded.id;
    let user = await Users.findById(userId);
    if (!user) {
      return ResponseUtilities.sendResponsData({
        statusCode: 404,
        message: MESSAGES.USER_CANNOT_BE_FOUND
      });
    }
    const payload:any={
      fullName,
      about,
    }

    if (req.files && req.files.length) {
      let files:any= req.files;
      payload.profilePicture = files[0]?.filename;
    }
    user= await Users.findOneAndUpdate({_id: userId},{$set:payload},{new: true})

    return ResponseUtilities.sendResponsData({
      statusCode: 404,
      message: MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,
      data: user,
    });


  } catch (error) {
    console.error(error);
    return ResponseUtilities.sendResponsData({
      statusCode: 500,
      message: MESSAGES.USER_CANNOT_BE_FOUND
    });
  }
};

export const getProfile = async (token: any, req: Request, res: Response) => {
  try {
    const decoded: any = await JWTUtilities.getDecoded(token);
    const userId = decoded.id;
    const user = await Users.findById(userId).select("-accessToken");
    if (!user) {
      return ResponseUtilities.sendResponsData({
        statusCode: 404,
        message: MESSAGES.USER_CANNOT_BE_FOUND
      });
    }
    return ResponseUtilities.sendResponsData({
      statusCode: 200,
      message: MESSAGES.USERS_FETCHED_SUCCESSFULLY,
      data: { ...user.toObject(), deviceToken: user.deviceToken }
    });
  }

  catch (error) {
    return ResponseUtilities.sendResponsData({
      statusCode: 200,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};












export const registerPhone = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;
  let STATIC_OTP = 123456;
  try {
    let user: any = await Users.findOne({ phoneNumber });
    if (!user) {
      user = new Users({ phoneNumber });
    }
    user.otp = STATIC_OTP;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    return ResponseUtilities.sendResponsData({
      statusCode: 200,
      message: MESSAGES.OTP_SENT,
      otp: STATIC_OTP
    });
  } catch (error) {
    console.error("Error during phone registration:", error);
    return ResponseUtilities.sendResponsData({
      statusCode: 500,
      message: MESSAGES.INTERNAL_SERVER_ERROR
    });
  }
};

export const getProfileById = async (req: Request, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await Users.findById(userId).select("-accessToken");
    if (!user) {
      return ResponseUtilities.sendResponsData({
        statusCode: 404,
        message: MESSAGES.USER_CANNOT_BE_FOUND
      });
    }
    return ResponseUtilities.sendResponsData({
      statusCode: 200,
      message: MESSAGES.USERS_FETCHED_SUCCESSFULLY,
      data: user
    });
  }
  catch (error) {
    next(error);
  }
};

export const verifyGoogleAuth = async (req: Request, res: Response) => {
  try {
    const { idToken, role } = req.body;

    if (!idToken || !role) {
      return res.status(400).json({ message: "ID Token and Role are required" });
    }

    // Verify Google ID Token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, uid } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user in MongoDB
    let user = await Users.findOne({ email });

    // If user doesn't exist, create new user
    if (!user) {
      user = new Users({
        fullName: name,
        email,
        authProvider: "google",
        role,
        googleUid: uid,
      });
      await user.save();
    }

    // Check if user is blocked, suspended, or deleted
    if (user.isBlocked) {
      return res.status(403).json({ message: "User is blocked by admin" });
    }
    if (user.isDeleted) {
      return res.status(403).json({ message: "User account is deleted" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        authProvider: user.authProvider,
        role: user.role,
        accessToken: token,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};









































// export const loginGuestUser = async (req: Request, res: Response): Promise<Response> => {

//   try {
//     const sessionId = uuidv4();
//     const guestUser = new Users({
//       isGuest: true,
//       sessionId: sessionId,
//       guestSessionExpiredAt: moment().add(1, 'hour').toDate(),
//     })
//     await guestUser.save();
//     return EbookUtilities.sendResponsData({
//       statusCode: 200,
//       message: GUEST_LOGIN_SUCCESS,
//       data: {
//         sessionId: guestUser.sessionId,
//         guestSessionExpiredAt: guestUser.guestSessionExpiredAt,
//       }
//     });
//   } catch (error) {
//     console.log(error)
//     return EbookUtilities.sendResponsData({
//       statusCode: 500,
//       message: INTERNAL_SERVER_ERROR
//     });
//   }
// };


// export const validateGuestSession = async (req: Request, res: Response, next: any): Promise<Response | void> => {
//   try {
//     const { sessionId } = req.headers;
//     if (!sessionId) {
//       return  EbookUtilities.sendResponsData({
//         statusCode: 500,
//         message: MISSING_SESSION_ID
//       });


//     }

//     const guestUser = await Users.findOne({ sessionId, isGuest: true });

//     if (!guestUser) {
//       return  EbookUtilities.sendResponsData({
//         statusCode: 400,
//         message: INVALID_SESSION_ID
//       });

//     }

//     if (moment().isAfter(guestUser.guestSessionExpiredAt)) {
//       return  EbookUtilities.sendResponsData({
//         statusCode: 400,
//         message: GUEST_SESSION_EXPIRED

//       });
//     }

//     next();
//   } catch (error) {
//     return  EbookUtilities.sendResponsData({
//       statusCode: 500,
//       message: INTERNAL_SERVER_ERROR

//     });
//   }
// };





// export const resendOTP = async (req: Request, res: Response) => {
//   const { phoneNumber } = req.body;
//   let STATIC_OTP = 123456;

//   try {
//     const user:any = await Users.findOne({ phoneNumber });

//     if (!user) {
//       return EbookUtilities.sendResponsData({
//         statusCode: 400,
//         message: OTP_VERIFICATION_FAILED
//       })

//     }

//     if (user.otp !== otp) {
//       return EbookUtilities.sendResponsData({
//         statusCode: 400,
//         message: INVALID_OTP
//       })

//     }

//     if (new Date() > user.otpExpiresAt) {
//       return EbookUtilities.sendResponsData({
//         statusCode: 400,
//         message: EXPIRED_OTP
//       })
//     }

//     const token = generateToken(user._id.toString(), phoneNumber);
//     user.otp = 0;
//     user.otpVerified = true
//     user.otpExpiresAt = undefined;
//     await user.save();

//     return {
//       statusCode:200,
//       message: REGISTRATION_SUCCESSFUL,
//       data: {
//         _id: user._id,
//         phoneNumber: user.phoneNumber,
//         accessToken: token,
//         expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
//       },
//     };
//   } catch (error) {
//     return EbookUtilities.sendResponsData({
//       statusCode: 500,
//       message: INTERNAL_SERVER_ERROR

//     });
//   }
// };
