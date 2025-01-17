import mongoose, { Schema } from "mongoose";
import { IReviewModel } from "@/interfaces/IReviewModel";

const ReviewSchema = new Schema<IReviewModel>({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	serviceId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Service",
		required: true,
	},
	rating: { type: Number, required: true },
	comment: { type: String },
	createdAt: { type: Date, default: Date.now },
});

const ReviewModel =
	mongoose.models.Review ||
	mongoose.model<IReviewModel>("Review", ReviewSchema);
export default ReviewModel;
