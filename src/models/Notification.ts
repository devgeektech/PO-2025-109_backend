import mongoose, { Schema } from 'mongoose';
import { INotification } from '../core/interface/notification';

// Define the Notification schema

const notificationSchema: Schema = new Schema(
  {
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model, replace 'User' with your actual User model name
      required: true,
    }],
    message: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true, // Description field added, required
    },
    type: {
      type: String,
      default: 'property'
    },
    isBroadcast: {
      type: Boolean,
      default: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: false, // No `createdAt` or `updatedAt` fields added
  }
);

// Create and export the model
const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
