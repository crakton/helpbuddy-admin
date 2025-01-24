import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
	bookings: [] as any[],
	pendingBookings: [] as any[],
	inProgreessBookings: [] as any[],
	completedBookings: [] as any[],
	canceledBookings: [] as any[],
	recentBookings: [] as any[],
};

const booking_slice = createSlice({
	name: "Booking_Slice",
	initialState,
	reducers: {
		setBookings: (state, action: PayloadAction<any[]>) => {
			state.bookings = action.payload;
		},
		setPendingBookings: (state, action: PayloadAction<any[]>) => {
			state.pendingBookings = action.payload;
		},
		setInProgreessBookings: (state, action: PayloadAction<any[]>) => {
			state.inProgreessBookings = action.payload;
		},
		setCanceledBookings: (state, action: PayloadAction<any[]>) => {
			state.canceledBookings = action.payload;
		},
		setCompletedBookings: (state, action: PayloadAction<any[]>) => {
			state.completedBookings = action.payload;
		},
		setRecentBookings: (state, action: PayloadAction<any[]>) => {
			state.recentBookings = action.payload;
		},
	},
});

export const {
	setBookings,
	setRecentBookings,
	setPendingBookings,
	setCompletedBookings,
	setCanceledBookings,
	setInProgreessBookings,
} = booking_slice.actions;
export default booking_slice.reducer;
