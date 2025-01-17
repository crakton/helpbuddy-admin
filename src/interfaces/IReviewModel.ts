import mongoose, { Document } from "mongoose";

export interface IReviewModel extends Document {
	userId: mongoose.Types.ObjectId;
	serviceId: mongoose.Types.ObjectId;
	rating: number;
	comment: string;
	createdAt: Date;
}
