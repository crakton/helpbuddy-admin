import mongoose, { Schema } from "mongoose";
import { IServiceSubCategoryModel } from "@/interfaces/IServiceSubCategoryModel";

const ServiceSubCategorySchema = new Schema<IServiceSubCategoryModel>({
	name: { type: String, required: true },
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "ServiceCategory",
		required: true,
	},
	createdAt: { type: Date, default: Date.now },
});

const ServiceSubCategoryModel =
	mongoose.models.ServiceSubCategory ||
	mongoose.model<IServiceSubCategoryModel>(
		"ServiceSubCategory",
		ServiceSubCategorySchema
	);
export default ServiceSubCategoryModel;
