import { setLoading } from "@/redux/features/app/loading_slice";
import { TStore, store } from "@/redux/store";
import { handleAuthErrors } from "@/utils/auth.util";
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
			// const response = await axios.get<TSuccessResponse<T_Bookings[]>>(
			// 	`/api/bookings?page=${page}`,
			// 	{ headers }
			// );
			// // Extract data
			// const { data, totalPages } = response.data;
			// // Update Redux state
			// this.store.dispatch(setBookings(data));
			// this.store.dispatch(setTotalPages(totalPages));
		} catch (error) {
			// Handle errors

			handleAuthErrors(error);
		}
	}
}
