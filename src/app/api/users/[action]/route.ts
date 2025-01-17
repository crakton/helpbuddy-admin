import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ConnectDB from "@/backend/config/db";
import UserModel from "@/backend/models/User";

// Ensure the database connection is initialized only once
let isConnected = false;

async function ensureDBConnection() {
	if (!isConnected) {
		await ConnectDB();
		isConnected = mongoose.connection.readyState === 1; // 1 = connected
	}
}

export async function GET(
	request: Request,
	{ params }: { params: { action: string } }
) {
	await ensureDBConnection();
	const { action } = params;

	try {
		if (action === "all-user") {
			const categories = await UserModel.find();
			return NextResponse.json({ success: true, categories });
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
