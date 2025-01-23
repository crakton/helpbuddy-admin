import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ConnectDB from "@/backend/config/db";
import ServiceModel from "@/backend/models/Service";

import ServiceCategoryModel from "@/backend/models/ServiceCategory";
import ServiceSubCategoryModel from "@/backend/models/ServiceSubCategory";
import uploadImageToAppwrite from "@/utils/uploadImageToAppwrite";
import { BUCKET_IDS } from "@/constants/bucket_id";

let isConnected = false;

async function ensureDBConnection() {
	if (!isConnected) {
		await ConnectDB();
		isConnected = mongoose.connection.readyState === 1;
	}
}

export async function POST(
	request: Request,
	{ params }: { params: { action: string } }
) {
	await ensureDBConnection();
	const { action } = params;

	// Service Creation Handler
	if (action === "create") {
		try {
			const formData = await request.formData();

			// Extract service data from formData
			const serviceData = {
				name: formData.get("name"),
				categoryId: formData.get("category")?.toString().trim(), // Trim whitespace
				creatorId: formData.get("creatorId")?.toString().trim(), // Trim whitespace
				subcategory: formData.get("subcategory")?.toString().trim(),
				price: Number(formData.get("price")),
				description: formData.get("description"),
				duration: Number(formData.get("duration")),
				// Parse JSON strings for complex data
				availability: formData.get("availability")
					? JSON.parse(formData.get("availability") as string)
					: [],
				location: formData.get("location")
					? JSON.parse(formData.get("location") as string)
					: undefined,
				status: formData.get("status") || "active",
				isRemoteService: formData.get("isRemoteService") === "true",
				maxParticipants: Number(formData.get("maxParticipants")) || 1,
				cancellationPolicy:
					formData.get("cancellationPolicy")?.toString().trim() || "moderate",
				tags: formData.get("tags")
					? JSON.parse(formData.get("tags") as string)
					: [],
			};

			// Validate availability format before saving
			if (
				serviceData.availability &&
				!Array.isArray(serviceData.availability)
			) {
				return NextResponse.json(
					{ success: false, error: "Availability must be an array" },
					{ status: 400 }
				);
			}

			// Handle image uploads
			const files = formData.getAll("serviceImages") as File[];
			if (!files.length) {
				return NextResponse.json(
					{ success: false, error: "At least one service image is required" },
					{ status: 400 }
				);
			}

			// Upload images to Appwrite
			const imageUrls = await Promise.all(
				files.map((file) =>
					uploadImageToAppwrite(file, BUCKET_IDS.SERVICES_IMAGES)
				)
			);

			// Create service with image URLs
			const service = new ServiceModel({
				...serviceData,
				serviceImages: imageUrls,
			});

			await service.save();

			return NextResponse.json(
				{
					success: true,
					service,
					message: "Service created successfully with images",
				},
				{ status: 201 }
			);
		} catch (error: any) {
			return NextResponse.json(
				{
					success: false,
					error: error.message || "Error creating service",
				},
				{ status: 500 }
			);
		}
	}

	// Category Creation Handler
	if (action === "create-category") {
		try {
			const formData = await request.formData();

			const categoryData = {
				name: formData.get("name"),
			};

			const file = formData.get("categoryImage") as File;
			if (!file) {
				return NextResponse.json(
					{ success: false, error: "Category image is required" },
					{ status: 400 }
				);
			}

			// Upload image to Appwrite
			const imageUrl = await uploadImageToAppwrite(
				file,
				"678e9100000affab5574"
			);

			// Create category with image URL
			const category = new ServiceCategoryModel({
				...categoryData,
				categoryImage: imageUrl,
			});

			await category.save();

			return NextResponse.json(
				{
					success: true,
					category,
					message: "Category created successfully with image",
				},
				{ status: 201 }
			);
		} catch (error: any) {
			return NextResponse.json(
				{
					success: false,
					error: error.message || "Error creating category",
				},
				{ status: 500 }
			);
		}
	}
	if (action === "create-subcategory") {
		try {
			const body = await request.json();
			const { name, category } = body;

			// Create category with image URL
			const subcategory = new ServiceSubCategoryModel({ name, category });

			await subcategory.save();

			return NextResponse.json(
				{
					success: true,
					subcategory,
					message: "Subcategory created successfully",
				},
				{ status: 201 }
			);
		} catch (error: any) {
			return NextResponse.json(
				{
					success: false,
					error: error.message || "Error creating category",
				},
				{ status: 500 }
			);
		}
	}

	// Update Handler (remains JSON-based)
	if (action === "update") {
		try {
			const body = await request.json();
			const { id, ...data } = body;

			const updatedService = await ServiceModel.findByIdAndUpdate(id, data, {
				new: true,
			});
			if (!updatedService) {
				return NextResponse.json(
					{ success: false, message: "Service not found" },
					{ status: 404 }
				);
			}

			return NextResponse.json({ success: true, service: updatedService });
		} catch (error: any) {
			return NextResponse.json(
				{
					success: false,
					error: error.message || "Error updating service",
				},
				{ status: 500 }
			);
		}
	}

	return NextResponse.json(
		{ success: false, message: "Invalid action" },
		{ status: 400 }
	);
}

// Your existing GET and DELETE handlers remain the same...

// GET Handler
export async function GET(
	request: Request,
	{ params }: { params: { action: string } }
) {
	await ensureDBConnection();
	const { action } = params;

	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "10", 10);

		// List Categories
		if (action === "categories") {
			const categories = await ServiceCategoryModel.find();
			return NextResponse.json({ success: true, categories });
		}

		// List Subcategories
		if (action === "subcategories") {
			const subCategories = await ServiceSubCategoryModel.find().populate(
				"category"
			);
			return NextResponse.json({ success: true, subCategories });
		}

		if (action === "") {
			const services = await ServiceModel.find()
				.skip((page - 1) * limit)
				.limit(limit);
			const total = await ServiceModel.countDocuments();

			return NextResponse.json({
				success: true,
				services,
				pagination: {
					total,
					page,
					pages: Math.ceil(total / limit),
				},
			});
		}

		if (action === "get-service") {
			const id = searchParams.get("id");
			if (!id) {
				return NextResponse.json(
					{ success: false, message: "Service ID is required" },
					{ status: 400 }
				);
			}

			const service = await ServiceModel.findById(id);
			if (!service) {
				return NextResponse.json(
					{ success: false, message: "Service not found" },
					{ status: 404 }
				);
			}

			return NextResponse.json({ success: true, service });
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

// DELETE Handler
export async function DELETE(
	request: Request,
	{ params }: { params: { action: string } }
) {
	await ensureDBConnection();
	const { action } = params;

	try {
		const { searchParams } = new URL(request.url);

		if (action === "delete-service") {
			const id = searchParams.get("id");
			if (!id) {
				return NextResponse.json(
					{ success: false, message: "Service ID is required" },
					{ status: 400 }
				);
			}

			const deletedService = await ServiceModel.findByIdAndDelete(id);
			if (!deletedService) {
				return NextResponse.json(
					{ success: false, message: "Service not found" },
					{ status: 404 }
				);
			}

			return NextResponse.json({
				success: true,
				message: "Service deleted successfully",
			});
		}

		// Delete Category
		if (action === "delete-category") {
			const id = searchParams.get("id");
			if (!id) {
				return NextResponse.json(
					{ success: false, message: "Category ID is required" },
					{ status: 400 }
				);
			}

			const deletedCategory = await ServiceCategoryModel.findByIdAndDelete(id);
			if (!deletedCategory) {
				return NextResponse.json(
					{ success: false, message: "Category not found" },
					{ status: 404 }
				);
			}

			return NextResponse.json({
				success: true,
				message: "Category deleted successfully",
			});
		}

		// Delete Subcategory
		if (action === "delete-subcategory") {
			const id = searchParams.get("id");
			if (!id) {
				return NextResponse.json(
					{ success: false, message: "Subcategory ID is required" },
					{ status: 400 }
				);
			}

			const deletedSubCategory =
				await ServiceSubCategoryModel.findByIdAndDelete(id);
			if (!deletedSubCategory) {
				return NextResponse.json(
					{ success: false, message: "Subcategory not found" },
					{ status: 404 }
				);
			}

			return NextResponse.json({
				success: true,
				message: "Subcategory deleted successfully",
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
