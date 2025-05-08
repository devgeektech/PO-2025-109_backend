import { Document } from "mongoose";

export interface IUser extends Document {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    authProvider?: 'email' | 'google' | 'facebook' | 'apple' | 'phone' | 'guest';
    isDeleted: boolean;
    isBlocked: boolean;
    accessToken?: string;
    otp?: string;
    otpVerified: boolean;
    otpExpiredAt?: Date;
    forgotPasswordLink?: string;
    linkVerified?: boolean;
    linkExpiredAt?: Date;
    isGuest: boolean;
    sessionId?: string;
    guestSessionExpiredAt?: Date;
    role: 'user' | 'admin' | 'guest';
    deletedAt?: Date;
    googleUid?: string;
    facebookUid?: string;
    appleUid?: string;
    notificationsEnabled: boolean;
    profilePicture?: string;
    about?: string;
    deviceToken?: string;
}
