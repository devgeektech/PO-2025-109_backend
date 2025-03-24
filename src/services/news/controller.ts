import { NextFunction, Request, Response } from "express";
import { HTTP400Error } from "../../utils/http-errors";
import { ResponseUtilities } from "../../utils/response.util";
import { MESSAGES } from "../../constants/messages";
import News from "../../models/News";

export const createNews = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const news = new News(payload);
    console.log(req.files)
    if(req.files && req.files.length) {
      let filesData:any = req.files[0]?.filename;
      news.image=filesData;
    }
    await news.save();
    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: news,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

export const getNewsById = async (
  req: Request,
  next: NextFunction
) => {
  try {
    const newsId = req.params.id;
    const news = await News.findByIdAndUpdate(
      newsId,
      { $inc: { views: 1 } },
      { new: true } 
    );

    if (!news) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.NEWS_ERRORS.NEWS_NOT_EXIST,
        })
      );
    }

    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: news,
    });
  } catch (error) {
    next(error);
  }
};


export const getNewsInsights = async ( next: NextFunction ) => {
  try {
    const newsInsights = await News.aggregate([
      {
        $match: { isDeleted: false }
      },
      {
        $group: {
          _id: null,
          totalNews: { $sum: 1 }, // Counts the number of documents
          totalViews: { $sum:  "$views" } // Sums the length of the views array
        }
      }
    ]);

    const response = newsInsights.length > 0 
      ? { news: newsInsights[0].totalNews, views: newsInsights[0].totalViews }
      : { news: 0, views: 0 };

    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: response,
    });

  } catch (error) {
    next(error);
  }
};


export const getAllNews = async (req: Request, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const searchTerm = (req.query.search as string) || "";
    const category = (req.query.category as string) || "";

    // Initialize the searchQuery object
    let searchQuery: any = {
      isDeleted: false,
      $or: [],
    };

    // Add search term filter if provided
    if (searchTerm) {
      searchQuery.$or.push({ title: { $regex: searchTerm, $options: 'i' } });
    }

    // Add propertyType filter if provided
    if (category) {
      searchQuery.category = category;
    }

    // If no search term or other filters exist, remove $or from searchQuery
    if (!searchQuery.$or?.length) {
      delete searchQuery.$or;
    }

    // Pagination settings
    const skip = (page - 1) * limit;

    // Fetch properties based on the searchQuery
    const newsList = await News.find(searchQuery).sort({createdAt: -1})
      .skip(skip)
      .limit(limit);

    // Get total record count for pagination
    const totalRecords = await News.countDocuments(searchQuery);

    // Return response with pagination data
    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: newsList,
      total: totalRecords,
    });
  } catch (error) {
    next(error);
  }
};


export const updateNews = async (req: Request, next: NextFunction) => {
  try {
    const propertyId = req.params.id;
    const payload = req.body;
    const updatedProperty = await News.findByIdAndUpdate(
      propertyId,
      payload,
      { new: true } // Return the updated document
    ).exec();

    if (!updatedProperty) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.NEWS_ERRORS.NEWS_NOT_EXIST,
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

export const deleteNews = async (req: Request, next: NextFunction) => {
  try {
    const propertyId = req.params.id;
    const result = await News.findOneAndUpdate(
      { _id: propertyId },
      { isDeleted: true }
    ).exec();

    if (!result) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.NEWS_ERRORS.NEWS_NOT_EXIST,
        })
      );
    }

    return ResponseUtilities.sendResponsData({ code: 200, message: "Success" }); // Return true if deletion was successful
  } catch (error) {
    next(error);
  }
};

