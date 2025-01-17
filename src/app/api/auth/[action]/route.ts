import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ConnectDB from "@/backend/config/db";
import UserModel from "@/backend/models/User";
import { EUserType } from "@/constants/enums";

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
	await ensureDBConnection(); // Ensure DB connection is established
	const { action } = params;

	try {
		const body = await request.json();

		if (action === "register") {
			const { name, email, password, phone } = body;

			// Create a new user with hashed password (handled in UserSchema pre-save hook)
			const user = new UserModel({ name, email, password, phone });
			await user.save();

			return NextResponse.json({ success: true, user }, { status: 201 });
		}

		if (action === "login") {
			const { email, password } = body;
			console.log("Login attempt:", { email, password });

			// Find the user by email
			// Fetch the user and test password comparison
			const fetchedUser = await UserModel.findOne({
				email,
			});
			if (!fetchedUser) {
				return NextResponse.json(
					{ success: false, message: "User not found" },
					{ status: 404 }
				);
			}
			// Compare the password using the model's method
			const isPasswordCorrect = await fetchedUser.comparePassword(password);
			if (!isPasswordCorrect) {
				return NextResponse.json(
					{ success: false, message: "Invalid credentials" },
					{ status: 401 }
				);
			}
			if (fetchedUser.role === EUserType.User) {
				return NextResponse.json(
					{ success: false, message: "Restricted privileges" },
					{ status: 401 }
				);
			}

			return NextResponse.json({
				success: true,
				user: fetchedUser,
				message: "Login successful",
			});
		}

		// Invalid action
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
