import { Document } from "mongoose";

// The IChatRoom interface extends Document to include Mongoose document properties
export interface INews extends Document  {
    title: string;
    category: string;
    link: string;
    file?: string;
    fileType?: string;
    description:string;
    views: number;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
