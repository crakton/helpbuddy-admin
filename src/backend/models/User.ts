import { IUser } from "@/interfaces/IUser";
import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";

// Define the User schema
const UserSchema = new Schema<IUser>({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	phone: { type: String },
	password: { type: String, required: true },
	status: {
		type: String,
		enum: ["active", "inactive", "blocked"],
		default: "active",
	},
	role: {
		type: String,
		enum: ["user", "admin", "provider"],
		default: "user",
	},
	createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to hash the password before saving it to the database
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (err: any) {
		return next(err);
	}
});

// Method to compare a candidate password with the hashed password
UserSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	try {
		const isMatch = await bcrypt.compare(candidatePassword, this.password);
		return isMatch;
	} catch (error) {
		console.error("Error comparing passwords:", error);
		throw new Error("Error while comparing passwords");
	}
};

// Create the User model
const UserModel =
	mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;

export const seedoneUser = async () => {
	try {
		// Create a new user
		const newUser = new UserModel({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "securePassword123",
		});
		await newUser.save();

		// Fetch the user and test password comparison
		const fetchedUser = await UserModel.findOne({
			email: "john.doe@example.com",
		});
		if (fetchedUser) {
			const isPasswordCorrect = await fetchedUser.comparePassword(
				"securePassword123"
			);
			console.log("Password is correct:", isPasswordCorrect);
		}
	} catch (error) {
		console.error(error);
	}
};
