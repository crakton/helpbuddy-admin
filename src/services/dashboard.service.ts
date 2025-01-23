import { headers } from "@/constants/http_config";
import { IService } from "@/interfaces/IService";
import { setRecentBookings } from "@/redux/features/app/booking_slice";
import { setLoading } from "@/redux/features/app/loading_slice";
import { setTopProviders } from "@/redux/features/app/provider_slice";
import { setTopServices } from "@/redux/features/app/service_slice";
import { TStore, store } from "@/redux/store";
import { fetchData, handleAuthErrors } from "@/utils/auth.util";
import axios, { AxiosError } from "axios";

export default class Dashboard {
	async getDashboardCards() {
		try {
			const data = await fetchData("/dashboard/get-stats", { method: "GET" });
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
