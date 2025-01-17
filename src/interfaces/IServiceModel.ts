import mongoose, { Document } from "mongoose";

export interface IServiceModel extends Document {
	name: string;
	service_images: string[];
	creator_ref: mongoose.Types.ObjectId;
	category: mongoose.Types.ObjectId;
	subcategory: mongoose.Types.ObjectId;
	price: number;
	description: string;
	createdAt: Date;
}
