import { IBooking } from "@/interfaces/booking.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookingsState {
	items: IBooking[];
	totalPages: number;
	loading: boolean;
	error: string | null;
	stats: { [key: string]: number };
}

const initialState: BookingsState = {
	items: [],
	totalPages: 1,
	loading: false,
	error: null,
	stats: {
		pending: 0,
		accepted: 0,
		completed: 0,
		cancelled: 0,
	},
};

const bookingsSlice = createSlice({
	name: "bookings",
	initialState,
	reducers: {
		setBookings: (
			state,
			action: PayloadAction<{
				bookings: IBooking[];
				totalPages: number;
			}>
		) => {
			state.items = action.payload.bookings;
			state.totalPages = action.payload.totalPages;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		setBookingStats: (
			state,
			action: PayloadAction<{
				pending: number;
				accepted: number;
				completed: number;
				cancelled: number;
			}>
		) => {
			state.stats = action.payload;
		},
		updateBookingStatus: (
			state,
			action: PayloadAction<{
				bookingId: string;
				status: IBooking["status"];
			}>
		) => {
			state.items = state.items.map((booking) =>
				booking.$id === action.payload.bookingId
					? { ...booking, status: action.payload.status }
					: booking
			);
		},
	},
});

export const {
	setBookings,
	setLoading,
	setError,
	setBookingStats,
	updateBookingStatus,
} = bookingsSlice.actions;

export default bookingsSlice.reducer;
