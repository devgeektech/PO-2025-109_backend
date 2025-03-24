import mongoose, { Schema , Types} from 'mongoose';
import { IInquiry } from '../core/interface/inquiry';

// Define the Inquiry schema

const inquirySchema: Schema = new Schema(
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
    property:{
      type: Types.ObjectId,
      ref: "Property",
      required: true
    },
    query: {
      type: String,
      required: true, // Query field added, required
    },
  },
  {
    timestamps: false, // No `createdAt` or `updatedAt` fields added
  }
);

// Create and export the model
const Inquiry = mongoose.model<IInquiry>('Inquiry', inquirySchema);

export default Inquiry;
