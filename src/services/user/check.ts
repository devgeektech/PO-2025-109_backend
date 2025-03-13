import { MESSAGES } from '../../constants/messages';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';

export const registerValidator = (req: Request, res: Response, next: NextFunction): any => {
  const { fullName, email, phoneNumber, password, authProvider } = req.body;
  const errors: any[] = [];

  if (!authProvider) {
    errors.push(MESSAGES.INVALID_AUTH_PROVIDER);
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push(MESSAGES.INVALID_EMAIL);
  }
  if (!password || password.length < 6) {
    errors.push(MESSAGES.PASSWORD_REQUIRED_LENGTH);
  }

  if (!phoneNumber || !/^\+?[1-9]\d{7,14}$/.test(phoneNumber)) {
    errors.push(MESSAGES.INVALID_PHONE_NUMBER);
  }

  if (errors.length > 0) {
    return res.status(400).json({ statusCode: 400, message: errors });
  }

  next();
};

export const loginValidator = (req: Request, res: Response, next: NextFunction): void => {
  const { authProvider, email, phoneNumber, password } = req.body;
  const errors: any[] = [];

  if (!authProvider || !['email', 'phone', 'guest'].includes(authProvider)) {
    errors.push(MESSAGES.INVALID_AUTH_PROVIDER);
  }

  if (authProvider === 'email') {
    if (!email || !email.trim()) {
      errors.push(MESSAGES.INVALID_EMAIL);
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push(MESSAGES.INVALID_EMAIL);
      }
    }
  }

  if (authProvider === 'phone') {
    if (!phoneNumber || !phoneNumber.trim()) {
      errors.push(MESSAGES.PHONE_NUMBER_REQUIRED_LOGIN);
    } else {
      const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/; // Simple phone number regex to validate country code and number
      if (!phoneNumberRegex.test(phoneNumber)) {
        errors.push(MESSAGES.INVALID_PHONE_NUMBER_FORMAT);
      }
    }
  }

  if (authProvider === 'email' && (!password || password.length < 6)) {
    errors.push(MESSAGES.PASSWORD_REQUIRED_LENGTH);
  }

  if (errors.length > 0) {
    res.status(400).json({ statusCode: 400, message: errors });
    return;
  }

  next();
};



export const emailValidator = (req: Request, res: Response, next: NextFunction): void => {
  const { email } = req.body;
  const errors: any[] = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push(MESSAGES.INVALID_EMAIL);
  }
  if (errors.length > 0) {
    res.status(400).json({ statusCode: 400, message: errors });
    return;
  }

  next();
};


export const registerPhoneValidator = (req: Request, res: Response, next: NextFunction): void => {
  const { phoneNumber } = req.body;
  const errors: any[] = [];


  if (phoneNumber === undefined || phoneNumber === null || phoneNumber.trim() === "") {
    errors.push(MESSAGES.MISSING_PHONE_NUMBER);
    res.status(400).json({ statusCode: 400, message: errors });
    return;
  }

  if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
    errors.push(MESSAGES.INVALID_PHONE_NUMBER);
    res.status(400).json({ statusCode: 400, message: errors });
    return;
  }
  next();
};

export const verifyOtpValidator = (req: Request, res: Response, next: NextFunction): void => {
  const { email, otp } = req.body;
  const errors: any[] = [];

  if (!email || email.trim() === "") {
    errors.push(MESSAGES.MISSING_REQUIRED_FIELDS);
  }


  // Validate otp
  if (!otp || otp.trim() === "") {
    errors.push(MESSAGES.MISSING_OTP);
  }

  if (otp && !/^\d{6}$/.test(otp)) {
    errors.push(MESSAGES.INVALID_OTP);
  }

  if (errors.length > 0) {
    res.status(400).json({ statusCode: 400, message: errors });
    return;
  }

  next();
};



export const updateProfileValidator = (req: Request, res: Response, next: NextFunction): void => {
  const { fullName, about, password } = req.body;
  const errors: any[] = [];

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 3) {
    errors.push(MESSAGES.FULL_NAME_REQUIRED);
  }

  if (!req.file) {
    errors.push(MESSAGES.PROFILE_PICTURE_REQUIRED);
  } else if (req.file.size > 2 * 1024 * 1024) { // 2MB limit
    errors.push(MESSAGES.PROFILE_PICTURE_SIZE_LIMIT);
  }

  // if (about && (typeof about !== 'string' || about.length > 1000)) {
  //   errors.push('About section must be a string with a maximum of 1000 characters.');
  // }


  if (!password || typeof password !== 'string' || password.length < 6) {

    errors.push(MESSAGES.PASSWORD_REQUIRED_LENGTH);
  }

  if (errors.length > 0) {
    res.status(400).json({ statusCode: 400, message: errors });
    return;
  }

  next();
};



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Save files in uploads directory
},
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Ensure unique filename
  },
});

// Multer configuration with file size limit and validation
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max file size
  fileFilter: (req, file, cb:any) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

export default upload;