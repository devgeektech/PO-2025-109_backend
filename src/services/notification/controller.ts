import { NextFunction, Request, Response } from "express";
import { HTTP400Error } from "../../utils/http-errors";
import { ResponseUtilities } from "../../utils/response.util";
import { MESSAGES } from "../../constants/messages";
import Notification from "../../models/Notification";


export const createBroadcastMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const notification = new Notification(payload);
    await notification.save();
    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: notification,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

export const getNotificationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findById(notificationId).exec();

    if (!notification) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.NOTIFICATION_ERRORS.NOTIFICATION_NOT_EXIST,
        })
      );
    }

    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllNotifications = async (req: Request, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const searchTerm = (req.query.search as string) || "";

    // Initialize the searchQuery object
    let searchQuery: any = {
      $or: [],
    };

    // Add search term filter if provided
    if (searchTerm) {
      searchQuery.$or.push({ title: { $regex: searchTerm, $options: 'i' } });
    }

    // If no search term or other filters exist, remove $or from searchQuery
    if (!searchQuery.$or?.length) {
      delete searchQuery.$or;
    }

    // Pagination settings
    const skip = (page - 1) * limit;

    // Fetch notifications based on the searchQuery
    const notifications = await Notification.find(searchQuery).sort({isRead: -1})
      .skip(skip)
      .limit(limit);

    // Get total record count for pagination
    const totalRecords = await Notification.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalRecords / limit);

    // Return response with pagination data
    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: notifications,
      pagination: {
        totalPages,
        currentPage: page,
        limit,
        totalRecords,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const getAllNotificationsByUser = async (req: Request, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const user = (req.params.id as string) || "";

    // Initialize the searchQuery object
    let searchQuery: any = {
      user
    };


    // Pagination settings
    const skip = (page - 1) * limit;

    // Fetch notifications based on the searchQuery
    const notifications = await Notification.find(searchQuery).sort({isRead: -1})
      .skip(skip)
      .limit(limit);

    // Get total record count for pagination
    const totalRecords = await Notification.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalRecords / limit);

    // Return response with pagination data
    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: notifications,
      pagination: {
        totalPages,
        currentPage: page,
        limit,
        totalRecords,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateNotification = async (req: Request, next: NextFunction) => {
  try {
    const propertyId = req.params.id;
    const payload = req.body;
    const updatedNotification = await Notification.findByIdAndUpdate(
      propertyId,
      payload,
      { new: true } // Return the updated document
    ).exec();

    if (!updatedNotification) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.NOTIFICATION_ERRORS.NOTIFICATION_NOT_EXIST,
        })
      );
    }

    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: updatedNotification,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req: Request, next: NextFunction) => {
  try {
    const propertyId = req.params.id;
    const result = await Notification.findOneAndUpdate(
      { _id: propertyId },
      { isDeleted: true }
    ).exec();

    if (!result) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.NOTIFICATION_ERRORS.NOTIFICATION_NOT_EXIST,
        })
      );
    }

    return ResponseUtilities.sendResponsData({ code: 200, message: "Success" }); // Return true if deletion was successful
  } catch (error) {
    next(error);
  }
};
