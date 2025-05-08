import Notification from "../models/Notification";
import { io } from "../server";

export const createNotification = async (userId: any, message: string, description: string, type: string='property') => {
    try {
      const newNotification = new Notification({
        user: userId,
        message: message,
        description: description,  // Added description
        type: type,
      });

      io.to(userId).emit("receiveNotification",newNotification);
      await newNotification.save();
      console.log('Notification created successfully!');
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };