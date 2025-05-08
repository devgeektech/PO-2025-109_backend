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

    if(req.files && req.files.length) {
      console.log(req.files);
      let filesData:any = req.files[0]?.filename;
      news.file=filesData;
      news.fileType= req.files[0]?.mimetype.split('/')[0];
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

    const skip = (page - 1) * limit;

    // Construct search filter
    const searchQuery: any = { isDeleted: false };

    if (searchTerm) {
      searchQuery.title = { $regex: searchTerm, $options: "i" };
    }

    if (category) {
      searchQuery.category = category;
    }

    // Aggregation pipeline
    const result = await News.aggregate([
      { $match: searchQuery },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }], // Paginated news
          totalCount: [{ $count: "count" }], // Total count
        },
      },
    ]);

    // Extract data and total count
    const newsList = result[0].data;
    const totalRecords = result[0].totalCount[0]?.count || 0;

    // Return response
    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: newsList,
      total:totalRecords
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRelatedNews = async (req: Request, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;
    const newsId = req.query.current as string;

    // Fetch the current news article
    const currentNews = await News.findById(newsId);

    if (!currentNews) {
      return ResponseUtilities.sendResponsData({
        code: 404,
        message: "News not found",
        data: [],
      });
    }

    // Construct search filter
    const searchQuery: any = {
      _id: { $ne: newsId }, // Exclude current news
      category: currentNews.category, // Find news in the same category
      isDeleted: false,
    };

    // Use text search for similar titles (Ensure text index is created)
    if (currentNews.title) {
      searchQuery.title = { $regex: currentNews.title, $options: "i" };
    }

    // Fetch related news
    const result = await News.find(searchQuery)
      .sort({ createdAt: -1 }) // Sort by recent
      .limit(limit);

    // Return response
    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


export const updateNews = async (req: any, next: NextFunction) => {
  try {
    const propertyId = req.params.id;
    const payload = req.body;

    if(req.files && req.files.length) {
      let filesData:any = req.files[0]?.filename;
      payload.file=filesData;
      payload.fileType= req.files[0]?.mimetype.split('/')[0];
    }
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

