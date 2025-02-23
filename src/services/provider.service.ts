import { Query } from "appwrite";
import { handleAuthErrors } from "@/lib/auth.util";
import appwrite from "@/appwrite-config";
import { COLLECTION_IDS } from "@/constants/collection_id";
import { BUCKET_IDS } from "@/constants/bucket_id";

export interface IProvider {
	$id?: string;
	userId: string;
	name: string;
	email: string;
	phone?: string;
	bio?: string;
	specialties?: string[];
	rating: number;
	totalBookings: number;
	totalEarnings: number;
	isVerified: boolean;
	isActive: boolean;
	createdAt: string;
}

export default class ProviderManager {
	private databases;
	private storage;
	private DATABASE_ID = process.env.APPWRITE_DB_ID as string;
	private BUCKET_ID = BUCKET_IDS.SERVICES_IMAGES;
	private readonly ITEMS_PER_PAGE = 10;

	private readonly COLLECTIONS = {
		PROVIDERS: COLLECTION_IDS.PROVIDERS,
		SERVICES: COLLECTION_IDS.SERVICES,
		REVIEWS: COLLECTION_IDS.REVIEWS,
		BOOKINGS: COLLECTION_IDS.BOOKINGS,
	};

	constructor() {
		this.storage = appwrite.storage;
		this.databases = appwrite.databases;
	}

	/**
	 * Get paginated list of providers sorted by rating
	 */
	async getProviders(page: number = 1) {
		try {
			const offset = (page - 1) * this.ITEMS_PER_PAGE;

			const response = await this.databases.listDocuments(
				this.DATABASE_ID,
				this.COLLECTIONS.PROVIDERS,
				[
					Query.limit(this.ITEMS_PER_PAGE),
					Query.offset(offset),
					Query.orderDesc("rating"),
				]
			);

			return {
				providers: response.documents,
				totalPages: Math.ceil(response.total / this.ITEMS_PER_PAGE),
			};
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	/**
	 * Get provider details by ID
	 */
	async getProviderById(providerId: string) {
		try {
			return await this.databases.getDocument(
				this.DATABASE_ID,
				this.COLLECTIONS.PROVIDERS,
				providerId
			);
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	/**
	 * Create a new provider
	 */
	async createProvider(providerData: IProvider) {
		try {
			return await this.databases.createDocument(
				this.DATABASE_ID,
				this.COLLECTIONS.PROVIDERS,
				providerData.$id as string, // If ID is provided, use it; otherwise, Appwrite generates one
				providerData
			);
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	/**
	 * Update provider details
	 */
	async updateProvider(providerId: string, updates: Partial<IProvider>) {
		try {
			return await this.databases.updateDocument(
				this.DATABASE_ID,
				this.COLLECTIONS.PROVIDERS,
				providerId,
				updates
			);
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	/**
	 * Delete provider by ID
	 */
	async deleteProvider(providerId: string) {
		try {
			await this.databases.deleteDocument(
				this.DATABASE_ID,
				this.COLLECTIONS.PROVIDERS,
				providerId
			);
			return { success: true };
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	/**
	 * Get all services offered by a provider
	 */
	async getProviderServices(providerId: string) {
		try {
			const response = await this.databases.listDocuments(
				this.DATABASE_ID,
				this.COLLECTIONS.SERVICES,
				[Query.equal("providerId", providerId), Query.equal("isActive", true)]
			);
			return response.documents;
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	/**
	 * Get all bookings related to a provider
	 */
	async getProviderBookings(providerId: string) {
		try {
			const response = await this.databases.listDocuments(
				this.DATABASE_ID,
				this.COLLECTIONS.BOOKINGS,
				[Query.equal("providerId", providerId), Query.orderDesc("$createdAt")]
			);
			return response.documents;
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}
}
