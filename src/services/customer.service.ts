// lib/customer.manager.ts
import { ID, Query } from "appwrite";
import { handleAuthErrors } from "@/lib/auth.util";
import appwrite from "@/appwrite-config";
import { toast } from "react-toastify";
import { store } from "@/lib/store";
import { COLLECTION_IDS } from "@/constants/collection_id";
import { ICustomer } from "@/interfaces/customer.interface";

export default class CustomerManager {
	private databases;
	private DATABASE_ID = process.env.APPWRITE_DB_ID;
	private ITEMS_PER_PAGE = 10;

	private COLLECTIONS = {
		CUSTOMERS: COLLECTION_IDS.CUSTOMERS,
		BOOKINGS: COLLECTION_IDS.BOOKINGS,
	};

	constructor() {
		this.databases = appwrite.databases;
	}

	async getCustomers(page: number = 1, searchQuery?: string) {
		try {
			const offset = (page - 1) * this.ITEMS_PER_PAGE;

			let queries = [
				Query.limit(this.ITEMS_PER_PAGE),
				Query.offset(offset),
				Query.orderDesc("$createdAt"),
			];

			if (searchQuery) {
				queries.push(Query.search("name", searchQuery));
			}

			const customers = await this.databases.listDocuments(
				this.DATABASE_ID as string,
				this.COLLECTIONS.CUSTOMERS,
				queries
			);

			// Enhance customers with booking counts
			const enhancedCustomers = await Promise.all(
				customers.documents.map(async (customer) => {
					const bookings = await this.databases.listDocuments(
						this.DATABASE_ID as string,
						this.COLLECTIONS.BOOKINGS,
						[Query.equal("userId", customer.$id)]
					);

					return {
						...customer,
						totalBookings: bookings.total,
					};
				})
			);

			const totalPages = Math.ceil(customers.total / this.ITEMS_PER_PAGE);

			return {
				customers: enhancedCustomers,
				totalPages,
			};
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	async createCustomer(customerData: Omit<ICustomer, "$id" | "createdAt">) {
		try {
			const customer = await this.databases.createDocument(
				this.DATABASE_ID as string,
				this.COLLECTIONS.CUSTOMERS,
				ID.unique(),
				customerData
			);

			toast.success("Customer created successfully");
			return customer;
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	async updateCustomer(customerId: string, customerData: Partial<ICustomer>) {
		try {
			const customer = await this.databases.updateDocument(
				this.DATABASE_ID as string,
				this.COLLECTIONS.CUSTOMERS,
				customerId,
				customerData
			);

			toast.success("Customer updated successfully");
			return customer;
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	async deleteCustomer(customerId: string) {
		try {
			await this.databases.deleteDocument(
				this.DATABASE_ID as string,
				this.COLLECTIONS.CUSTOMERS,
				customerId
			);

			toast.success("Customer deleted successfully");
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}

	async getCustomerStats() {
		try {
			const [active, inactive, total] = await Promise.all([
				this.databases.listDocuments(
					this.DATABASE_ID as string,
					this.COLLECTIONS.CUSTOMERS,
					[Query.equal("status", "active")]
				),
				this.databases.listDocuments(
					this.DATABASE_ID as string,
					this.COLLECTIONS.CUSTOMERS,
					[Query.equal("status", "inactive")]
				),
				this.databases.listDocuments(
					this.DATABASE_ID as string,
					this.COLLECTIONS.CUSTOMERS
				),
			]);

			return {
				active: active.total,
				inactive: inactive.total,
				total: total.total,
			};
		} catch (error) {
			handleAuthErrors(error);
			throw error;
		}
	}
}

export const customerManager = new CustomerManager();
