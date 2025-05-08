import mongoose, { Schema } from 'mongoose';
import { ISite } from '../core/interface/site';

// Define the AboutUs schema

const siteSchema: Schema = new Schema(
  {
    teams:[
      {
        name: {
          type: String,
          required: true,
          index: true,
          trim: true
        },
        avatar: {
          type: String
        },
        code: {
          type: String,
          required: true
        },
        email: {
          type: String,
          required: true,
          trim: true,
          lowercase: true
        },
        phone: {
          type: String,
          required: true
        },
        bio: String
      }
    ],
  },
  {
    timestamps: false, // No `createdAt` or `updatedAt` fields added
  }
);

// Create and export the model
const Site = mongoose.model<ISite>('Site', siteSchema);

export default Site;
