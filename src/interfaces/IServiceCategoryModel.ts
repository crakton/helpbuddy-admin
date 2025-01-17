import { Document } from "mongoose";

export interface IServiceCategoryModel extends Document {
	name: string;
	createdAt: Date;
}
