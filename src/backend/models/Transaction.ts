import mongoose, { Schema } from "mongoose";
import { ITransactionModel } from "@/interfaces/ITransactionModel";

const TransactionSchema = new Schema<ITransactionModel>({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	amount: { type: Number, required: true },
	status: {
		type: String,
		enum: ["success", "failed", "pending"],
		default: "pending",
	},
	createdAt: { type: Date, default: Date.now },
});

const TransactionModel =
	mongoose.models.Transaction ||
	mongoose.model<ITransactionModel>("Transaction", TransactionSchema);
export default TransactionModel;
