import mongoose, { Document } from "mongoose";

export interface ITransactionModel extends Document {
	userId: mongoose.Types.ObjectId;
	amount: number;
	status: "success" | "failed" | "pending";
	createdAt: Date;
}
