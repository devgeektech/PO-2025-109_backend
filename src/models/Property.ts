import mongoose, { Schema } from "mongoose";
import { IProperty } from "../core/interface/property";

const propertySchema = new Schema<IProperty>(
  {
    name: {
      type: String,
      required: true,
      index:true
    },
    buildingStatus:{
      type: String,
      enum:['existing','completed'],
      required: true
    },
    buildings:{
      type:Number,
      default: 0
    },
    units:{
      type:Number,
      default: 0
    },
    gba: {
      type: String,
      required: true
    },
    floors:{
      type:Number,
      default: 0
    },
    occupancy:{
      type:Number,
      default: 0,
      max: 100
    },
    showOnLoopNet:{
      type:Boolean,
      default: false
    },
    yearBuilt:{
      type:Number,
      default: 0,
    },
    yearRenovated:{
      type:Number,
      default: 0,
    },
    metering:{
      type: String,
      enum:['individual','master'],
      default:"individual"
    },
    construction:{
      type:String
    },
    elevators:{
      type: Number
    },
    elevatorWalkUp:{
      type: Boolean,
      default: false
    },
    parking:{
      type: String
    },
    landArea:{
      type: Number,
      default: 0
    },
    landAreaUnit:{
      type: String,
    },
    zoning:{
      type: String
    },
    zoningDescription: {
      type: String,
      default:""
    },
    images:[{
      type: String,
    }],
    isDeleted:{
      type: Boolean,
      default: false
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      transform: function (doc: IProperty, ret: any) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Property= mongoose.model<IProperty>("Property", propertySchema);

export default Property;
