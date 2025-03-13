import { Document } from "mongoose";

// The IChatRoom interface extends Document to include Mongoose document properties
export interface IProperty extends Document  {
    name: string;
    buildingStatus: "existing" | "completed";
    buildings?: number;
    units?: number;
    gba: string;
    floors?: number;
    occupancy?: number;
    showOnLoopNet?: boolean;
    yearBuilt?: number;
    yearRenovated?: number;
    metering?: "individual" | "master";
    construction?: string;
    elevators?: number;
    elevatorWalkUp?: boolean;
    parking?: string;
    landArea?: number;
    landAreaUnit?: string;
    zoning?: string;
    zoningDescription?: string;
    images?: string[];
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
