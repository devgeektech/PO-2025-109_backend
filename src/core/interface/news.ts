import { Document } from "mongoose";

// The IChatRoom interface extends Document to include Mongoose document properties
export interface INews extends Document  {
    title: string;
    category: string;
    link: string;
    image?: string;
    description:string;
    views: string[];
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
