import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ConnectDB from "@/backend/config/db";
import UserModel from "@/backend/models/User";
import { EUserType } from "@/constants/enums";
import ServiceModel from "@/backend/models/Service";
import BookingModel from "@/backend/models/Booking";

// Ensure the database connection is initialized only once
let isConnected = false;

async function ensureDBConnection() {
	if (!isConnected) {
		await ConnectDB();
		isConnected = mongoose.connection.readyState === 1; // 1 = connected
	}
}

export async function POST(
	request: Request,
	{ params }: { params: { action: string } }
) {
	await ensureDBConnection();
	const { action } = params;

	try {
		const body = await request.json();

		return NextResponse.json(
			{ success: false, message: "Invalid action" },
			{ status: 400 }
		);
	} catch (error: any) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

export async function GET(
	request: Request,
	{ params }: { params: { action: string } }
) {
	await ensureDBConnection();
	const { action } = params;
	const { searchParams } = new URL(request.url);
	const role = searchParams.get("role");

	try {
		if (action === "get-stats") {
			if (role === EUserType.Provider) {
				// Provider-specific stats
				const providerId = searchParams.get("providerId"); // Get the provider's ID

				// Get only services and stats related to this provider
				const providerServices = await ServiceModel.find({
					provider: providerId,
				});

				// Getbookings/appointments for this provider
				const providerBookings = await BookingModel.find({
					provider: providerId,
				});

				return NextResponse.json({
					success: true,
					data: [
						{
							total_services: providerServices.length,
							name: "My Services",
						},
						{
							total_bookings: providerBookings.length,
							name: "My Bookings",
						},
					],
					message: "Provider dashboard statistics",
				});
			} else {
				// Admin stats
				const users = await UserModel.find({ role: EUserType.User });
				const providers = await UserModel.find({ role: EUserType.Provider });
				const services = await ServiceModel.find();

				return NextResponse.json({
					success: true,
					data: [
						{
							total_users: users.length,
							name: "Total Users",
						},
						{
							total_providers: providers.length,
							name: "Total Providers",
						},
						{
							total_services: services.length,
							name: "Total Services",
						},
					],
					message: "Admin dashboard statistics",
				});
			}
		}

		return NextResponse.json(
			{ success: false, message: "Invalid action" },
			{ status: 400 }
		);
	} catch (error: any) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
