import { NextFunction, Request, Response } from "express";
import { HTTP400Error } from "../../utils/http-errors";
import { ResponseUtilities } from "../../utils/response.util";
import { MESSAGES } from "../../constants/messages";
import Property from "../../models/Property";
import { unlink } from "fs";

export const createProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const property = new Property(payload);

    if (req.files && req.files.length) {
      let filesData: any = req.files;
      for (const file of filesData) {
        const mType = file?.mimetype.split('/')[0];
        if (mType == 'image') {
          property.images?.push(file?.filename);
        } else {
          property.videos?.push(file?.filename);
        }
      }
    }
    await property.save();
    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: property,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

export const getPropertyById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId).exec();

    if (!property) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.PROPERTY_ERRORS.PROPERTY_NOT_EXIST,
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

export const getAllProperties = async (req: Request, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const searchTerm = (req.query.search as string) || "";
    const propertyType = (req.query.propertyType as string) || "";
    const buildings = parseInt(req.query.buildings as string) || 0;
    const floors = parseInt(req.query.floors as string) || 0;
    const metering = (req.query.metering as string) || "";
    const startLandArea = parseInt(req.query.startLandArea as string) || 0;
    const endLandArea = parseInt(req.query.endLandArea as string) || 0;

    const skip = (page - 1) * limit;

    // Construct the search filter
    const searchQuery: any = { isDeleted: false };

    if (searchTerm) {
      searchQuery.name = { $regex: searchTerm, $options: "i" };
    }

    if (propertyType) {
      searchQuery.propertyType = propertyType;
    }

    if (buildings > 0) {
      searchQuery.buildings = { $gte: buildings };
    }

    if (metering) {
      searchQuery.metering = metering;
    }

    if (floors > 0) {
      searchQuery.floors = { $gte: floors };
    }

    if (startLandArea > 0 || endLandArea > 0) {
      searchQuery.landArea = {};
      if (startLandArea > 0) {
        searchQuery.landArea.$gte = startLandArea;
      }
      if (endLandArea > 0) {
        searchQuery.landArea.$lte = endLandArea;
      }
    }

    // Aggregation pipeline
    const result = await Property.aggregate([
      { $match: searchQuery },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }], // Paginated properties
          totalCount: [{ $count: "count" }], // Total count
        },
      },
    ]);

    // Extract paginated data and total count
    const properties = result[0].data;
    const totalRecords = result[0].totalCount[0]?.count || 0;
    // Return response
    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: properties,
      total: totalRecords
    });
  } catch (error) {
    next(error);
  }
};

export const getRelatedProperties = async (req: Request, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;
    const propertyId = req.query.current as string;

    // Fetch the current property
    const currentProperty = await Property.findById(propertyId);
    if (!currentProperty) {
      return ResponseUtilities.sendResponsData({
        code: 404,
        message: "Property not found",
        data: [],
      });
    }

    // Construct search filter for related properties
    const searchQuery: any = {
      _id: { $ne: propertyId }, // Exclude the current property
      isDeleted: false, // Only fetch active properties
      propertyType: currentProperty.propertyType, // Match property type
    };

    // Optionally match by subType if it exists
    if (currentProperty.subType) {
      searchQuery.subType = currentProperty.subType;
    }

    // Optionally match by investment type
    if (currentProperty.investmentType) {
      searchQuery.investmentType = currentProperty.investmentType;
    }

    // Fetch related properties
    const relatedProperties = await Property.find(searchQuery)
      .sort({ createdAt: -1 }) // Get the latest properties
      .limit(limit);

    // Return response
    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: relatedProperties,
    });
  } catch (error) {
    next(error);
  }
};



export const updateProperty = async (req: Request, next: NextFunction) => {
  try {
    const propertyId = req.params.id;
    let payload = req.body;

    // Fetch existing property to preserve old media
    const existingProperty = await Property.findById(propertyId).exec();
    if (!existingProperty) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.PROPERTY_ERRORS.PROPERTY_NOT_EXIST,
        })
      );
    }

    // Initialize arrays if not present in payload
    payload.images = existingProperty.images || [];
    payload.videos = existingProperty.videos || [];

    if (req.files && req.files.length) {
      let filesData: any = req.files;
      for (const file of filesData) {
        const mType = file?.mimetype.split('/')[0];
        if (mType == 'image') {
          payload.images?.push(file?.filename);
        } else {
          payload.videos?.push(file?.filename);
        }
      }

    }

    console.log(payload)

    const updatedProperty = await Property.findOneAndUpdate(
      { _id: propertyId },
      { $set: payload },
      { new: true } // Return the updated document
    ).exec();

    if (!updatedProperty) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.PROPERTY_ERRORS.PROPERTY_NOT_EXIST,
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

export const deleteProperty = async (req: Request, next: NextFunction) => {
  try {
    const propertyId = req.params.id;
    const result = await Property.findOneAndUpdate(
      { _id: propertyId },
      { isDeleted: true }
    ).exec();

    if (!result) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.PROPERTY_ERRORS.PROPERTY_NOT_EXIST,
        })
      );
    }

    return ResponseUtilities.sendResponsData({ code: 200, message: "Success" }); // Return true if deletion was successful
  } catch (error) {
    next(error);
  }
};

export const deletePropertyImage = async (req: Request, next: NextFunction) => {
  try {
    const propertyId = req.params.id;
    const result = await Property.findOneAndUpdate(
      { _id: propertyId },
      {
        $pull: {
          images: req.body.filename,
          videos: req.body.filename
        }
      }
    ).exec();
    unlink("./public/uploads/" + req.body?.filename, (error) => {
      if (error) {
        console.log(`File delete error: ${error.message}`)
      }
    })
    if (!result) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.PROPERTY_ERRORS.PROPERTY_NOT_EXIST,
        })
      );
    }

    return ResponseUtilities.sendResponsData({ code: 200, message: "Success" }); // Return true if deletion was successful
  } catch (error) {
    next(error);
  }
};
