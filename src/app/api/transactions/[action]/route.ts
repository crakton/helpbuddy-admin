import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ConnectDB from "@/backend/config/db";
import TransactionModel from "@/backend/models/Transaction";

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

		if (action === "createTransaction") {
			const transaction = new TransactionModel(body);
			await transaction.save();
			return NextResponse.json({ success: true, transaction }, { status: 201 });
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

export async function GET(
	request: Request,
	{ params }: { params: { action: string } }
) {
	await ensureDBConnection();
	const { action } = params;

	try {
		if (action === "listTransactions") {
			const transactions = await TransactionModel.find().populate("userId");
			return NextResponse.json({ success: true, transactions });
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
