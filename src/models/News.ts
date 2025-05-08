import mongoose, { Schema } from "mongoose";
import { INews } from "../core/interface/news";

const newsSchema = new Schema<INews>(
  {
    title: {
      type: String,
      required: true,
      index:true
    },
    category:{
      type: String,
      required: true,
      index: true,
      trim: true
    },
    description: {
      type: String
    },
    link:{
      type: String
    },
    file:{
      type: String,
    },
    fileType: String,
    views:{
      type: Number,
      default:0
    },
    isDeleted:{
      type: Boolean,
      default: false
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      transform: function (doc: INews, ret: any) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

const News= mongoose.model<INews>("News", newsSchema);

export default News;
