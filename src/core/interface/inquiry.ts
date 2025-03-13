import mongoose, { Document } from "mongoose";

export interface IInquiry extends Document {
    _id: mongoose.Types.ObjectId;  
    name: string;             
    email: string;  
    phone: string;
    query: string;          
  }