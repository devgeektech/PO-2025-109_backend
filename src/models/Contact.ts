import mongoose, { Schema } from 'mongoose';
import { IContact } from '../core/interface/contact';

// Define the Contact schema

const contactSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email:{
      type: String,
      required: true,
      lowercase: true
    },
    phone:{
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true, // Description field added, required
    },
  },
  {
    timestamps: false, // No `createdAt` or `updatedAt` fields added
  }
);

// Create and export the model
const Contact = mongoose.model<IContact>('Contact', contactSchema);

export default Contact;
