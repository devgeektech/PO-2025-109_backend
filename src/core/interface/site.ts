import mongoose, { Document } from "mongoose";

export interface ISite extends Document {
    _id: mongoose.Types.ObjectId;  
    name: string;             
    email: string;  
    phone: string;
    description: string;          
  }