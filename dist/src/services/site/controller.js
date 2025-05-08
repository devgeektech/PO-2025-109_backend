"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSite = exports.updateSiteDetail = exports.getSiteDetail = exports.updateTeamMember = exports.addTeamMember = void 0;
const http_errors_1 = require("../../utils/http-errors");
const response_util_1 = require("../../utils/response.util");
const messages_1 = require("../../constants/messages");
const Site_1 = __importDefault(require("../../models/Site"));
const addTeamMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, email, phone, bio, code } = req.body;
        let avatar;
        if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.length) {
            avatar = req.files[0].filename;
        }
        const alreadyExist = yield Site_1.default.findOne({ 'teams.email': email });
        if (alreadyExist) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.SITE_ERRORS.TEAM_MEMBER_EXIST,
            }));
        }
        const payload = {
            name, email, phone, avatar, bio, code
        };
        const site = yield Site_1.default.findOneAndUpdate({}, { $push: { teams: payload } }, { new: true });
        console.log(site);
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: site,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.addTeamMember = addTeamMember;
const updateTeamMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, email, phone, bio, code } = req.body;
        let avatar;
        if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.length) {
            avatar = req.files[0].filename;
        }
        else {
            avatar = req.body.avatar;
        }
        const teamId = req.params.id;
        const checkExist = yield Site_1.default.findOne({ 'teams._id': teamId });
        if (!checkExist) {
            throw new http_errors_1.HTTP404Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 404,
                message: messages_1.MESSAGES.SITE_ERRORS.TEAM_MEMBER_NOT_EXIST,
            }));
        }
        const payload = {
            name, email, phone, avatar, bio, code
        };
        const site = yield Site_1.default.findOneAndUpdate({ 'teams._id': teamId }, { $set: { 'teams.$': payload } }, { new: true });
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: site,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.updateTeamMember = updateTeamMember;
const getSiteDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const property = yield Site_1.default.findOne({});
        if (!property) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.SITE_ERRORS.SITE_NOT_EXIST,
            }));
        }
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: property,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getSiteDetail = getSiteDetail;
const updateSiteDetail = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const site = req.params.id;
        const payload = req.body;
        const updatedProperty = yield Site_1.default.findByIdAndUpdate(site, payload, { new: true } // Return the updated document
        ).exec();
        if (!updatedProperty) {
            throw new http_errors_1.HTTP400Error(response_util_1.ResponseUtilities.sendResponsData({
                code: 400,
                message: messages_1.MESSAGES.SITE_ERRORS.SITE_NOT_EXIST,
            }));
        }
        return response_util_1.ResponseUtilities.sendResponsData({
            code: 200,
            message: "Success",
            data: updatedProperty,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateSiteDetail = updateSiteDetail;
//  Setup site if it not exist in database  //
const setupSite = () => __awaiter(void 0, void 0, void 0, function* () {
    let site = yield Site_1.default.findOne({});
    if (!site) {
        console.log('Admin site created successfully.');
        yield Site_1.default.create({
            teams: []
        });
    }
});
exports.setupSite = setupSite;
//# sourceMappingURL=controller.js.map