import mongoose, { Document } from "mongoose";

export interface IBookingModel extends Document {
	userId: mongoose.Types.ObjectId;
	serviceId: mongoose.Types.ObjectId;
	status: "pending" | "completed" | "cancelled" | "processing";
	createdAt: Date;
}
