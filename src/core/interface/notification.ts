import mongoose, { Document } from "mongoose";

export interface INotification extends Document {
    user: mongoose.Types.ObjectId;  // Reference to the user (can be a user model or just ObjectId)
    message: string;                // The message content of the notification
    description: string;            // A detailed description of the notification
    type: string;          
    isRead: boolean;                // Whether the notification is read or not
  }