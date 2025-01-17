import mongoose, { Schema } from "mongoose";
import { IServiceModel } from "@/interfaces/IServiceModel";

const ServiceSchema = new Schema<IServiceModel>({
	name: { type: String, required: true },
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "ServiceCategory",
		required: true,
	},
	creator_ref: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	service_images: {
		type: [String],
		required: true,
	},
	subcategory: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "ServiceSubCategory",
		required: true,
	},
	price: { type: Number, required: true },
	description: { type: String },
	createdAt: { type: Date, default: Date.now },
});

const ServiceModel =
	mongoose.models.Service ||
	mongoose.model<IServiceModel>("Service", ServiceSchema);
export default ServiceModel;
