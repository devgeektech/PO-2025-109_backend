import mongoose, { Schema } from "mongoose";
import { IProperty } from "../core/interface/property";
import { BUILDING_STATUS } from "../constants";

const propertySchema = new Schema<IProperty>(
  {
    name: {
      type: String,
      required: true,
      index:true
    },
    buildingStatus:{
      type: String,
      enum: BUILDING_STATUS,
      required: true
    },
    buildings:{
      type:Number,
      default: 1
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
      default: 1
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
    parking:{
      type: Number
    },
    elevatorWalkUp:{
      type: Boolean,
      default: false
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
    videos:[{
      type: String,
    }],
    permittedZoning:{
      type: String
    },
    brokerCoOp:{
      type: Boolean
    },
    askingPrice:{
      type: Number,
    },
    propertyType:{
      type: String,
      required: true
    },
    subType:{
      type: String
    },
    investmentType:{
      type: String,
      required: true
    },
    investmentSubType:{
      type: String
    },
    squareFootage:{
      type: Number
    },
    pricePerSquareFoot:{
      type: Number
    },
    capRate:{
      type: Number,
      min: 0,
      max: 100
    },
    proformaCapRate:{
      type: Number,
      min: 0,
      max: 100
    },
    noi:{
      type: Number,
    },
    proformaNOI:{
      type: Number,
    },
    keys:{
      type: Number,
      min: 0
    },
    stories:{
      type: Number
    },
    lotSizeAcres:{
       type: Number
    },
    parkingPerKey:{
      type: Number
    },
    apn:{
      type: String
    },
    pricePerKey:{
      type: Number
    },
    groundLease:{
      type: Boolean,
      default: false
    },
    ownership:{
      type: String
    },
    saleCondition:{
      type: String
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
      transform: function (doc: IProperty, ret: any) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Property= mongoose.model<IProperty>("Property", propertySchema);

export default Property;
