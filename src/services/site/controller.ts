import { NextFunction, Request, Response } from "express";
import { HTTP400Error, HTTP404Error } from "../../utils/http-errors";
import { ResponseUtilities } from "../../utils/response.util";
import { MESSAGES } from "../../constants/messages";
import Site from "../../models/Site";

export const addTeamMember = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name, email, phone, bio, code
    } = req.body;
    let avatar;
    if (req.files?.length) {
      avatar = req.files[0].filename;
    }

    const alreadyExist = await Site.findOne({ 'teams.email': email });
    if (alreadyExist) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.SITE_ERRORS.TEAM_MEMBER_EXIST,
        })
      );
    }
    const payload = {
      name, email, phone, avatar, bio, code
    };

    const site = await Site.findOneAndUpdate({}, { $push: { teams: payload } }, { new: true });
    console.log(site)
    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: site,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};


export const updateTeamMember = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name, email, phone, bio, code
    } = req.body;
    let avatar;
    if (req.files?.length) {
      avatar = req.files[0].filename;
    } else {
      avatar = req.body.avatar;
    }
    const teamId = req.params.id;
    const checkExist = await Site.findOne({ 'teams._id': teamId });
    if (!checkExist) {
      throw new HTTP404Error(
        ResponseUtilities.sendResponsData({
          code: 404,
          message: MESSAGES.SITE_ERRORS.TEAM_MEMBER_NOT_EXIST,
        })
      );
    }
    const payload = {
      name, email, phone, avatar, bio, code
    };

    const site = await Site.findOneAndUpdate({ 'teams._id': teamId }, { $set: { 'teams.$': payload } }, { new: true });

    return ResponseUtilities.sendResponsData({
      code: 200,
      message: "Success",
      data: site,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

export const getSiteDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const property = await Site.findOne({});

    if (!property) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.SITE_ERRORS.SITE_NOT_EXIST,
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

export const updateSiteDetail = async (req: Request, next: NextFunction) => {
  try {
    const site = req.params.id;
    const payload = req.body;
    const updatedProperty = await Site.findByIdAndUpdate(
      site,
      payload,
      { new: true } // Return the updated document
    ).exec();

    if (!updatedProperty) {
      throw new HTTP400Error(
        ResponseUtilities.sendResponsData({
          code: 400,
          message: MESSAGES.SITE_ERRORS.SITE_NOT_EXIST,
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


//  Setup site if it not exist in database  //
export const setupSite = async () => {
  let site: any = await Site.findOne({});
  if (!site) {
    console.log('Admin site created successfully.')
    await Site.create({
      teams: []
    });
  }
};
