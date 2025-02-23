import { ID, Query } from "appwrite";
import { handleAuthErrors } from "@/lib/auth.util";
import appwrite from "@/appwrite-config";
import { toast } from "react-toastify";
import { store, TStore } from "@/lib/store";
import { COLLECTION_IDS } from "@/constants/collection_id";

export interface IBooking {
	$id?: string;
	name: string;
	serviceId: string;
	providerId: string;
	userId: string;
	status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
	bookingDate: string;
	startTime: string;
	endTime: string;
	totalAmount: number;
	participants: number;
	notes?: string;
	createdAt?: string;
}

export default class BookingManager {
	private databases;
	private DATABASE_ID = process.env.APPWRITE_DB_ID;
	private ITEMS_PER_PAGE = 10;

	private COLLECTIONS = {
		BOOKINGS: COLLECTION_IDS.BOOKINGS,
		SERVICES: COLLECTION_IDS.SERVICES,
	};

	constructor() {
		this.databases = appwrite.databases;
	}

	async getBookings(page: number = 1, status?: string) {
		try {
			const offset = (page - 1) * this.ITEMS_PER_PAGE;
			const currentUserId = store.getState().auth.user?.$id;

			let queries = [
				Query.limit(this.ITEMS_PER_PAGE),
				Query.offset(offset),
				Query.orderDesc("$createdAt"),
			];

			if (status) {
				queries.push(Query.equal("status", status));
			}

			const bookings = await this.databases.listDocuments(
				this.DATABASE_ID as string,
				this.COLLECTIONS.BOOKINGS,
				queries
			);
			// Calculate total pages
			const totalPages = Math.ceil(bookings.total / this.ITEMS_PER_PAGE);

			// Enhance bookings with service information
			const enhancedBookings = await Promise.all(
				bookings.documents.map(async (booking) => {
					const service = await this.databases.getDocument(
						this.DATABASE_ID as string,
						this.COLLECTIONS.SERVICES,
						booking.serviceId
					);

					return {
						...booking,
						service,
					};
				})
			);

			const myBookings = enhancedBookings.filter(
				(booking) => booking.service.providerId === currentUserId
			);

			return {
				bookings: myBookings,
				totalPages,
			};
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	async updateBookingStatus(bookingId: string, status: IBooking["status"]) {
		try {
			const currentUserId = store.getState().auth.user?.$id;

			// Verify this booking belongs to the current provider
			const booking = await this.databases.getDocument(
				this.DATABASE_ID as string,
				this.COLLECTIONS.BOOKINGS,
				bookingId
			);

			await this.databases.updateDocument(
				this.DATABASE_ID as string,
				this.COLLECTIONS.BOOKINGS,
				bookingId,
				{ status }
			);

			toast.success(`Booking ${status} successfully`);
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	// async getBookingStats() {
	// 	try {
	// 		const currentUserId = store.getState().auth.user?.$id;

	// 		const [pending, accepted, completed, cancelled] = await Promise.all([
	// 			this.databases.listDocuments(
	// 				this.DATABASE_ID as string,
	// 				this.COLLECTIONS.BOOKINGS,
	// 				[
	// 					// Query.equal("providerId", currentUserId as string),
	// 					Query.equal("status", "pending"),
	// 				]
	// 			),
	// 			this.databases.listDocuments(
	// 				this.DATABASE_ID as string,
	// 				this.COLLECTIONS.BOOKINGS,
	// 				[
	// 					// Query.equal("providerId", currentUserId as string),
	// 					Query.equal("status", "accepted"),
	// 				]
	// 			),
	// 			this.databases.listDocuments(
	// 				this.DATABASE_ID as string,
	// 				this.COLLECTIONS.BOOKINGS,
	// 				[
	// 					// Query.equal("providerId", currentUserId as string),
	// 					Query.equal("status", "completed"),
	// 				]
	// 			),
	// 			this.databases.listDocuments(
	// 				this.DATABASE_ID as string,
	// 				this.COLLECTIONS.BOOKINGS,
	// 				[
	// 					// Query.equal("providerId", currentUserId as string),
	// 					Query.equal("status", "cancelled"),
	// 				]
	// 			),
	// 		]);

	// 		return {
	// 			pending: pending.total,
	// 			accepted: accepted.total,
	// 			completed: completed.total,
	// 			cancelled: cancelled.total,
	// 		};
	// 	} catch (error) {
	// 		handleAuthErrors(error);
	// 		throw error;
	// 	}
	// }
}

export const bookingManager = new BookingManager();
