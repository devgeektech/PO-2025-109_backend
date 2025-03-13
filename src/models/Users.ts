import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import moment from 'moment';
import { IUser } from '../core/interface/user';

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    authProvider: {
      type: String,
      enum: ['email', 'google', 'facebook', 'apple', 'phone', 'guest'],
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    accessToken: {
      type: String,
      default: '',
    },
    googleUid: {
      type: String,
      unique: true,
      sparse: true,
    },
    facebookUid: {
      type: String,
      unique: true,
      sparse: true,
    },
    appleUid: {
      type: String,
      unique: true,
      sparse: true,
    },
    otp: {
      type: String,
      default: '',
      trim: true,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    otpExpiredAt: {
      type: Date,
      default: moment().add(10, 'm').toDate(),
    },
    forgotPasswordLink: {
      type: String,
      default: '',
    },
    linkVerified: {
      type: Boolean,
      default: false,
    },
    linkExpiredAt: {
      type: Date,
      default: moment().add(1, 'hour').toDate(),
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    sessionId: {
      type: String,
      default: '',
    },
    guestSessionExpiredAt: {
      type: Date,
      default: moment().add(1, 'hour').toDate(),
    },
    role: {
      type: String,
      enum: ['user','admin'],
      default: 'user',
    },
    deletedAt: {
      type: Date,
      default: null,
    },

    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
    profilePicture: { type: String, default: '' },
    about: { type: String, trim: true, maxlength: 500, default: '' },
    deviceToken: { type: String, default: '' },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      transform: function (doc: IUser, ret: any) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash password before saving (if exists)
userSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Users = mongoose.model<IUser>('User', userSchema);

export default Users;
