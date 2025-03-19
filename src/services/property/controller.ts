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
    console.log(req.body)
    const payload = req.body;
    const property = new Property(payload);
    console.log(req.files)
    if(req.files && req.files.length) {
      let filesData:any = req.files;
      filesData= filesData.map((file:any) =>file.filename);
      property.images=filesData;
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
    const buildingStatus = (req.query.buildingStatus as string) || "";
    const buildings = parseInt(req.query.buildings as string) || 0;
    const units = parseInt(req.query.units as string) || 0;
    const floors = parseInt(req.query.floors as string) || 0;
    const startLandArea = parseInt(req.query.startLandArea as string) || 0;
    const endLandArea = parseInt(req.query.endLandArea as string) || 0;

    // Initialize the searchQuery object
    let searchQuery: any = {
      isDeleted: false,
      $or: [],
    };

    // Add search term filter if provided
    if (searchTerm) {
      searchQuery.$or.push({ name: { $regex: searchTerm, $options: 'i' } });
    }

    // Add propertyType filter if provided
    if (buildingStatus) {
      searchQuery.buildingStatus = buildingStatus;
    }

    // Add bedrooms filter if provided
    if (buildings > 0) {
      searchQuery.buildings = buildings;
    }

    // Add bathrooms filter if provided
    if (units > 0) {
      searchQuery.units = units;
    }

    if (floors > 0) {
      searchQuery.floors = floors;
    }
    // Add area range filter if provided
    if (startLandArea > 0 || endLandArea > 0) {
      searchQuery.landArea = {};
      if (startLandArea > 0) {
        searchQuery.landArea.$gte = startLandArea; 
      }
      if (endLandArea > 0) {
        searchQuery.landArea.$lte = endLandArea;
      }
    }

    // If no search term or other filters exist, remove $or from searchQuery
    if (!searchQuery.$or?.length) {
      delete searchQuery.$or;
    }

    // Pagination settings
    const skip = (page - 1) * limit;

    // Fetch properties based on the searchQuery
    const properties = await Property.find(searchQuery).sort({createdAt: -1})
      .skip(skip)
      .limit(limit);

    // Get total record count for pagination
    const totalRecords = await Property.countDocuments(searchQuery);
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


export const updateProperty = async (req: Request, next: NextFunction) => {
  try {
    const propertyId = req.params.id;
    const payload = req.body;
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      payload,
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
      { $pull: {
        images: req.body.filename
      } }
    ).exec();
    unlink("./public/uploads/"+req.body?.filename,(error)=>{
      if(error) {
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
