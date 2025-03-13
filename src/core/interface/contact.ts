import mongoose, { Document } from "mongoose";

export interface IContact extends Document {
    _id: mongoose.Types.ObjectId;  
    name: string;             
    email: string;  
    phone: string;
    description: string;          
  }