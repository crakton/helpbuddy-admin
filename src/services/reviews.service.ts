import { ID, Query } from "appwrite";
import { handleAuthErrors } from "@/lib/auth.util";
import appwrite from "@/appwrite-config";
import { toast } from "react-toastify";
import { store, TStore } from "@/lib/store";
import { COLLECTION_IDS } from "@/constants/collection_id";

interface Review {
	$id?: string;
	bookingId: string;
	customerId: string;
	providerId: string;
	serviceId: string;
	rating: number;
	comment: string;
	status: "pending" | "approved" | "rejected";
	createdAt: string;
}

export class ReviewManager {
	private store: TStore;
	private databases;
	private DATABASE_ID = process.env.APPWRITE_DB_ID;
	private ITEMS_PER_PAGE = 10;

	private readonly COLLECTIONS = {
		SERVICES: COLLECTION_IDS.SERVICES,
		PROVIDERS: COLLECTION_IDS.PROVIDERS,
		CUSTOMERS: COLLECTION_IDS.CUSTOMERS,
		REVIEWS: COLLECTION_IDS.REVIEWS,
		BOOKINGS: COLLECTION_IDS.BOOKINGS,
	};

	constructor() {
		this.store = store;
		this.databases = appwrite.databases;
	}

	async getReviews(
		page: number = 1,
		filters?: {
			status?: string;
			providerId?: string;
			serviceId?: string;
		}
	) {
		try {
			const offset = (page - 1) * this.ITEMS_PER_PAGE;
			let queries = [
				Query.limit(this.ITEMS_PER_PAGE),
				Query.offset(offset),
				Query.orderDesc("$createdAt"),
			];

			if (filters?.status) {
				queries.push(Query.equal("status", filters.status));
			}
			if (filters?.providerId) {
				queries.push(Query.equal("providerId", filters.providerId));
			}
			if (filters?.serviceId) {
				queries.push(Query.equal("serviceId", filters.serviceId));
			}

			const reviews = await this.databases.listDocuments(
				this.DATABASE_ID as string,
				this.COLLECTIONS.REVIEWS,
				queries
			);

			// Enhance reviews with related data
			const enhancedReviews = await Promise.all(
				reviews.documents.map(async (review) => {
					const [provider, service] = await Promise.all([
						this.databases.getDocument(
							this.DATABASE_ID as string,
							this.COLLECTIONS.PROVIDERS,
							review.providerId
						),
						this.databases.getDocument(
							this.DATABASE_ID as string,
							this.COLLECTIONS.SERVICES,
							review.serviceId
						),
					]);

					return {
						...review,
						provider,
						service,
					};
				})
			);

			return enhancedReviews;
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	async updateReviewStatus(reviewId: string, status: "approved" | "rejected") {
		try {
			const review = await this.databases.updateDocument(
				this.DATABASE_ID as string,
				this.COLLECTIONS.REVIEWS,
				reviewId,
				{ status }
			);

			// Update provider rating if review is approved
			if (status === "approved") {
				await this.updateProviderRating(review.providerId);
			}

			toast.success(`Review ${status} successfully`);
			return review;
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	private async updateProviderRating(providerId: string) {
		try {
			const reviews = await this.databases.listDocuments(
				this.DATABASE_ID as string,
				this.COLLECTIONS.REVIEWS,
				[
					Query.equal("providerId", providerId),
					Query.equal("status", "approved"),
				]
			);

			const totalRating = reviews.documents.reduce(
				(sum: number, review) => sum + review.rating,
				0
			);
			const averageRating = totalRating / reviews.total;

			await this.databases.updateDocument(
				this.DATABASE_ID as string,
				this.COLLECTIONS.PROVIDERS,
				providerId,
				{ rating: averageRating }
			);
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}
}
