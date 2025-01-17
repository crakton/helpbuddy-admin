import mongoose, { Document } from "mongoose";

export interface IServiceSubCategoryModel extends Document {
	name: string;
	category: mongoose.Types.ObjectId;
	createdAt: Date;
}
