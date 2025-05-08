import { NextFunction, Request, Response } from "express";
import { HTTP400Error } from "../../utils/http-errors";
import { ResponseUtilities } from "../../utils/response.util";
import { MESSAGES } from "../../constants/messages";
import Inquiry from "../../models/Inquiry";

export const createInquiry = async (
  req: Request,
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
    next(error);
  }
};

export const getInquiryById = async (
  req: Request,
  next: NextFunction
) => {
  try {
    const inquiryId = req.params.id;
    const inquiry = await Inquiry.findById(inquiryId).exec();

    if (!inquiry) {
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
      data: inquiry,
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

    const skip = (page - 1) * limit;

    // Construct search filter
    const searchQuery: any = searchTerm
      ? { name: { $regex: searchTerm, $options: "i" } }
      : {};

    // Aggregation pipeline
    const result = await Inquiry.aggregate([
      { $match: searchQuery },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "properties", // The collection name for Property
          localField: "property",
          foreignField: "_id",
          as: "propertyData",
        },
      },
      { $unwind: { path: "$propertyData", preserveNullAndEmptyArrays: true } },
      { 
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          query: 1,
          isOnMarket:1,
          createdAt: 1,
          property: { name: "$propertyData.name", _id:"$propertyData._id" }, // Project only needed fields
        }
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }], // Paginated data
          totalCount: [{ $count: "count" }], // Total count
        },
      },
    ]);

    // Extract data and total count
    const properties = result[0].data;
    const totalRecords = result[0].totalCount[0]?.count || 0;
    // Return response
    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: properties,
      total:totalRecords,
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
