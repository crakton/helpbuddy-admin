import { TStore, store } from "@/redux/store";
import { handleAuthErrors } from "@/utils/auth.util";

export default class Dashboard {
	private store: TStore;

	constructor() {
		this.store = store;
	}
	async getDashboardCards() {
		try {
			const data = [{ title: "Total Bookings", value: 0 }];
			return data;
		} catch (error) {
			handleAuthErrors(error);
		}
	}
	async getBookingsSummary() {
		try {
		} catch (error) {
			handleAuthErrors(error);
		}
	}
	async getDashboardStats() {
		try {
		} catch (error) {
			handleAuthErrors(error);
		}
	}
	async getTopServices() {
		try {
		} catch (error) {
			handleAuthErrors(error);
		}
	}
	async getTopProviders() {
		try {
		} catch (error) {
			handleAuthErrors(error);
		}
	}

	async getRecentBookings() {
		try {
		} catch (error) {
			handleAuthErrors(error);
		}
	}
}
