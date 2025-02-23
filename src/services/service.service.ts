import { service } from "./../constants/data";
import { ID, Query } from "appwrite";
import { handleAuthErrors } from "@/lib/auth.util";
import appwrite from "@/appwrite-config";
import { toast } from "react-toastify";
import { store, TStore } from "@/lib/store";
import { BUCKET_IDS } from "@/constants/bucket_id";
import { COLLECTION_IDS } from "@/constants/collection_id";
import uploadImageToAppwrite from "@/lib/uploadImageToAppwrite";
import { IService } from "@/interfaces/service.interface";

export interface ServiceCategory {
	$id?: string;
	name: string;
	description: string;
	imageUrl?: string;
	parentId?: string;
	isActive: boolean;
	createdAt?: string;
}

export default class ServiceManager {
	private store: TStore;
	private databases;
	private storage;
	private DATABASE_ID = process.env.APPWRITE_DB_ID;
	private BUCKET_ID = BUCKET_IDS.SERVICES_IMAGES;
	private ITEMS_PER_PAGE = 10;

	private COLLECTIONS = {
		SERVICES: COLLECTION_IDS.SERVICES,
		CATEGORIES: COLLECTION_IDS.CATEGORIES,
		SUBCATEGORIES: COLLECTION_IDS.SUB_CATEGORIES,
	};

	constructor() {
		this.store = store;
		this.databases = appwrite.databases;
		this.storage = appwrite.storage;
	}

	async getServices(page: number = 1) {
		try {
			const offset = (page - 1) * this.ITEMS_PER_PAGE;

			const services = await this.databases.listDocuments(
				this.DATABASE_ID as string,
				this.COLLECTIONS.SERVICES,
				[
					Query.limit(this.ITEMS_PER_PAGE),
					Query.offset(offset),
					Query.orderDesc("$createdAt"),
				]
			);

			// Calculate and set total pages
			const totalPages = Math.ceil(services.total / this.ITEMS_PER_PAGE);

			// Enhance services with category information
			const enhancedServices = await Promise.all(
				services.documents.map(async (service) => {
					const category = await this.databases.getDocument(
						this.DATABASE_ID as string,
						this.COLLECTIONS.CATEGORIES,
						service.categoryId
					);

					return {
						category,
						totalPages,
					};
				})
			);

			return { services, ajacentProps: enhancedServices };
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	async getCategories(page: number = 1) {
		try {
			const offset = (page - 1) * this.ITEMS_PER_PAGE;

			const categories = await this.databases.listDocuments(
				this.DATABASE_ID as string,
				this.COLLECTIONS.CATEGORIES,
				[
					Query.limit(this.ITEMS_PER_PAGE),
					Query.offset(offset),
					// Query.orderDesc("$createdAt"),
				]
			);
			const totalPages = Math.ceil(categories.total / this.ITEMS_PER_PAGE);
			return { categories: categories.documents, totalPages };
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	async verifyService(serviceId: string) {
		try {
			await this.databases.updateDocument(
				this.DATABASE_ID as string,
				this.COLLECTIONS.SERVICES,
				serviceId,
				{
					isVerified: true,
				}
			);
			toast.success("Service verified successfully");
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	async blockService(serviceId: string) {
		try {
			const service = await this.databases.getDocument(
				this.DATABASE_ID as string,
				this.COLLECTIONS.SERVICES,
				serviceId
			);

			await this.databases.updateDocument(
				this.DATABASE_ID as string,
				this.COLLECTIONS.SERVICES,
				serviceId,
				{
					isBlocked: !service.isBlocked,
				}
			);

			toast.success(
				`Service ${service.isBlocked ? "unblocked" : "blocked"} successfully`
			);
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	async getCategoriesforCreation() {
		try {
			const categories = await this.databases.listDocuments(
				this.DATABASE_ID as string,
				this.COLLECTIONS.CATEGORIES,
				[
					Query.equal("isActive", true),
					Query.equal("parentId", "null"),
					Query.limit(100),
				]
			);
			return categories.documents;
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	async deleteCategory(categoryId: string, COLLECTION_ID: string) {
		try {
			// Check if category has services
			const services = await this.databases.listDocuments(
				this.DATABASE_ID as string,
				this.COLLECTIONS.SERVICES
				// [Query.equal("categoryId", categoryId)]
			);

			if (services.total > 0) {
				toast.error("Cannot delete category with active services");
				return;
			}

			await this.databases.deleteDocument(
				this.DATABASE_ID as string,
				COLLECTION_ID,
				categoryId
			);

			toast.success("Category deleted successfully");
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	async getSubCategories(/* categoryId: string */) {
		try {
			const subCategories = await this.databases.listDocuments(
				this.DATABASE_ID as string,
				this.COLLECTIONS.SUBCATEGORIES
				// [Query.equal("parentId", categoryId), Query.equal("isActive", true)]
			);

			return { subCategories: subCategories.documents };
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	async createCategory(
		category: Omit<ServiceCategory, "$id" | "createdAt">,
		COLLECTION_ID: string
	) {
		try {
			const newCategory = await this.databases.createDocument(
				this.DATABASE_ID as string,
				COLLECTION_ID,
				ID.unique(),
				{
					...category,
					isActive: true,
					createdAt: new Date().toISOString(),
				}
			);

			toast.success("Category created successfully");
			return newCategory;
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	async editCategory(
		payload: Partial<ServiceCategory>,
		id: string,
		COLLECTION_ID: string
	) {
		try {
			const updatedCategory = await this.databases.updateDocument(
				this.DATABASE_ID as string,
				COLLECTION_ID,
				id,
				payload
			);

			toast.success("Category updated successfully");
			return updatedCategory;
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	async createService(
		payload: Omit<IService, "$id" | "createdAt">,
		images: File[]
	) {
		try {
			// Upload images first
			const imageIds = await Promise.all(
				images.map(async (image) => {
					const file = await uploadImageToAppwrite(image, this.BUCKET_ID);
					return file.uri;
				})
			);

			const service = {
				...payload,
				providerId: this.store.getState().auth.user?.$id,
				images: imageIds,
				isVerified: false,
				isBlocked: false,
				isActive: true,
				createdAt: new Date().toISOString(),
				duration: Number(payload.duration),
				maxParticipants: Number(payload.maxParticipants),
				availability: payload.availability.map((e) => JSON.stringify(e)),
			};

			// Create service document
			const newService = await this.databases.createDocument(
				this.DATABASE_ID as string,
				this.COLLECTIONS.SERVICES,
				ID.unique(),
				service
			);

			toast.success("Service created successfully");
			return newService;
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}
}

export const serviceManager = new ServiceManager();
