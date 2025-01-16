import bcrypt from "bcrypt";
import UserModel from "../models/User";

const adminUsers = [
	{
		name: "Super Admin",
		email: "redemptionjonathan@outlook.com",
		password: "password1234",
		role: "admin",
		isAdmin: true,
	},
	{
		name: "Super Admin",
		email: "linusvandu@gmail.com",
		password: "marylin123",
		role: "admin",
		isAdmin: true,
	},
	{
		name: "Super Admin",
		email: "helpbuddy@example.com",
		password: "test1234",
		role: "admin",
		isAdmin: true,
	},
];

const seedAdminUsers = async () => {
	try {
		const existingAdmin = await UserModel.findOne({ role: "admin" });

		if (existingAdmin) {
			console.log("Admin users already exist. Skipping seeding.");
			return;
		}

		// Create admin users
		for (const admin of adminUsers) {
			const newAdmin = new UserModel(admin);
			await newAdmin.save(); // Trigger pre-save hook
		}

		console.log(`${adminUsers.length} admin users created successfully!`);
	} catch (error) {
		console.error("Error seeding admin users:", error);
	}
};

export default seedAdminUsers;
