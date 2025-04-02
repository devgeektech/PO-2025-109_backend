import { NextFunction, Request, Response } from "express";
import { HTTP400Error } from "../../utils/http-errors";
import { ResponseUtilities } from "../../utils/response.util";
import { MESSAGES } from "../../constants/messages";
import Contact from "../../models/Contact";

export const createContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const contact = new Contact(payload);
    await contact.save();
    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: contact,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

export const getContactById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const propertyId = req.params.id;
    const property = await Contact.findById(propertyId).exec();

    if (!property) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.CONTACT_ERRORS.CONTACT_NOT_EXIST,
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
export const getAllContacts = async (req: Request, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const searchTerm = (req.query.search as string) || "";

    const skip = (page - 1) * limit;

    // Construct search filter
    const searchQuery: any = searchTerm
      ? { name: { $regex: searchTerm, $options: "i" } }
      : {};

    // Aggregate pipeline to get paginated results and total count
    const result = await Contact.aggregate([
      { $match: searchQuery },
      { $sort: { createdAt: -1 } },
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
      total: totalRecords,
    });
  } catch (error) {
    next(error);
  }
};



export const updateContact = async (req: Request, next: NextFunction) => {
  try {
    const propertyId = req.params.id;
    const payload = req.body;
    const updatedProperty = await Contact.findByIdAndUpdate(
      propertyId,
      payload,
      { new: true } // Return the updated document
    ).exec();

    if (!updatedProperty) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.CONTACT_ERRORS.CONTACT_NOT_EXIST,
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

export const deleteContact = async (req: Request, next: NextFunction) => {
  try {
    const propertyId = req.params.id;
    const result = await Contact.findByIdAndDelete(propertyId).exec();

    if (!result) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.CONTACT_ERRORS.CONTACT_NOT_EXIST,
        })
      );
    }

    return ResponseUtilities.sendResponsData({ code: 200, message: "Success" }); // Return true if deletion was successful
  } catch (error) {
    next(error);
  }
};
