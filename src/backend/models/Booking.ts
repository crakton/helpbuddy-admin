import mongoose, { Schema } from "mongoose";
import { IBookingModel } from "@/interfaces/IBookingModel";

const BookingSchema = new Schema<IBookingModel>({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	serviceId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Service",
		required: true,
	},
	status: {
		type: String,
		enum: ["pending", "completed", "cancelled", "processing"],
		default: "pending",
	},
	createdAt: { type: Date, default: Date.now },
});

const BookingModel =
	mongoose.models.Booking ||
	mongoose.model<IBookingModel>("Booking", BookingSchema);
export default BookingModel;
