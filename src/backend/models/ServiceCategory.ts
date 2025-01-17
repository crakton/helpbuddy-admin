import mongoose, { Schema } from "mongoose";
import { IServiceCategoryModel } from "@/interfaces/IServiceCategoryModel";

const ServiceCategorySchema = new Schema<IServiceCategoryModel>({
	name: { type: String, required: true, unique: true },
	createdAt: { type: Date, default: Date.now },
});

const ServiceCategoryModel =
	mongoose.models.ServiceCategory ||
	mongoose.model<IServiceCategoryModel>(
		"ServiceCategory",
		ServiceCategorySchema
	);
export default ServiceCategoryModel;
