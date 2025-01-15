import { headers } from "@/constants/http_config";
import {
	setBookings,
	setRecentBookings,
} from "@/redux/features/app/booking_slice";
import { setLoading } from "@/redux/features/app/loading_slice";
import { setTotalPages } from "@/redux/features/app/util_slice";
import { TStore, store } from "@/redux/store";
import { TErrorResponse, TSuccessResponse } from "@/types/auth.types";
import { T_Bookings } from "@/types/bookings";
import { T_loading_provider } from "@/types/loader.types";
import { handleAuthErrors } from "@/utils/auth.util";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

export default class Booking {
	private store: TStore;

	constructor() {
		this.store = store;
	}

	// Method to fetch bookings
	public async fetchBookings(page: number = 1): Promise<void> {
		this.store.dispatch(setLoading(true)); // Set loading state

		try {
			// Make API request
			const response = await axios.get<TSuccessResponse<T_Bookings[]>>(
				`/api/bookings?page=${page}`,
				{ headers }
			);

			// Extract data
			const { data, totalPages } = response.data;

			// Update Redux state
			this.store.dispatch(setBookings(data));
			this.store.dispatch(setTotalPages(totalPages));
		} catch (error) {
			// Handle errors
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<TErrorResponse>;
				if (axiosError.response) {
					// Show error toast
					toast.error(axiosError.response.data.message || "An error occurred while fetching bookings.");
				} else {
					toast.error("Network error or server is unreachable.");
				}
			} else {
				console.error("Unexpected error:", error);
				toast.error("An unexpected error occurred.");
			}

			// Dispatch authentication error handling if needed
			handleAuthErrors(error);
		} finally {
			// Reset loading state
			this.store.dispatch(setLoading(false));
		}
	}
}
