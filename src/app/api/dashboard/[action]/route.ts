import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ConnectDB from "@/backend/config/db";
import UserModel from "@/backend/models/User";
import { EUserType } from "@/constants/enums";
import ServiceModel from "@/backend/models/Service";

// Ensure the database connection is initialized only once
let isConnected = false;

async function ensureDBConnection() {
	if (!isConnected) {
		await ConnectDB();
		isConnected = mongoose.connection.readyState === 1; // 1 = connected
	}
}

// Service Category Handlers
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
	// const body = await request.json();
	try {
		if (action === "get-stats") {
			// const { user_id } = body;
			const users = await UserModel.find({ role: EUserType.User });
			const providers = await UserModel.find({ role: EUserType.Provider });
			const services = await ServiceModel.find();
			return NextResponse.json({
				success: true,
				data: {
					total_users: users.length,
					totoal_providers: providers.length,
					total_services: services.length,
				},
				message: "Dashboard statistics",
			});
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
