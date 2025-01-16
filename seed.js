import seedAdminUsers from "./src/backend/seeders/admin";
import mongoose from "mongoose";

const seedDatabase = async () => {
	try {
		// Connect to MongoDB
		await mongoose.connect(process.env.MONGODB_URI);

		console.log("Connected to MongoDB successfully!");

		// Run the admin seeder
		await seedAdminUsers();

		console.log("Database seeding completed!");

		// Close the database connection
		await mongoose.connection.close();
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	}
};

// Run the seeder
seedDatabase();
