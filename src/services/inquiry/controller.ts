import { NextFunction, Request, Response } from "express";
import { HTTP400Error } from "../../utils/http-errors";
import { ResponseUtilities } from "../../utils/response.util";
import { MESSAGES } from "../../constants/messages";
import Inquiry from "../../models/Inquiry";

export const createInquiry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const inquiry = new Inquiry(payload);
    await inquiry.save();
    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: inquiry,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

export const getInquiryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const propertyId = req.params.id;
    const property = await Inquiry.findById(propertyId).exec();

    if (!property) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.INQUIRY_ERRORS.INQUIRY_NOT_EXIST,
        })
      );
    }

    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllInquiries = async (req: Request, next: NextFunction) => {
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
      searchQuery.$or.push({ name: { $regex: searchTerm, $options: 'i' } });
    }

    // If no search term or other filters exist, remove $or from searchQuery
    if (!searchQuery.$or?.length) {
      delete searchQuery.$or;
    }

    // Pagination settings
    const skip = (page - 1) * limit;

    // Fetch properties based on the searchQuery
    const properties = await Inquiry.find(searchQuery).sort({createdAt: -1})
      .skip(skip)
      .limit(limit);

    // Get total record count for pagination
    const totalRecords = await Inquiry.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalRecords / limit);

    // Return response with pagination data
    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: properties,
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


export const updateInquiry = async (req: Request, next: NextFunction) => {
  try {
    const propertyId = req.params.id;
    const payload = req.body;
    const updatedProperty = await Inquiry.findByIdAndUpdate(
      propertyId,
      payload,
      { new: true } // Return the updated document
    ).exec();

    if (!updatedProperty) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.INQUIRY_ERRORS.INQUIRY_NOT_EXIST,
        })
      );
    }

    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInquiry = async (req: Request, next: NextFunction) => {
  try {
    const propertyId = req.params.id;
    const result = await Inquiry.findByIdAndDelete(propertyId).exec();

    if (!result) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.INQUIRY_ERRORS.INQUIRY_NOT_EXIST,
        })
      );
    }

    return ResponseUtilities.sendResponsData({ code: 200, message: "Success" }); // Return true if deletion was successful
  } catch (error) {
    next(error);
  }
};
