import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Models } from "appwrite";

const initialState = {
	customers: [] as Models.User<Models.Preferences>[],
	customer: {} as Models.User<Models.Preferences>,
	customerCard: {} as {},
	customerBookings: [] as any[],
	customerStatus: "all",
};

const customer_slice = createSlice({
	name: "Customer_Slice",
	initialState,
	reducers: {
		setCustomers: (
			state,
			action: PayloadAction<Models.User<Models.Preferences>[]>
		) => {
			state.customers = action.payload;
		},
		setCustomer: (
			state,
			action: PayloadAction<Models.User<Models.Preferences>>
		) => {
			state.customer = action.payload;
		},
		setCustomerCard: (state, action: PayloadAction<{}>) => {
			state.customerCard = action.payload;
		},
		setCustomerBookings: (state, action: PayloadAction<any[]>) => {
			state.customerBookings = action.payload;
		},
		setCustomerStatus: (state, action: PayloadAction<string>) => {
			state.customerStatus = action.payload;
		},
	},
});

export const {
	setCustomers,
	setCustomer,
	setCustomerCard,
	setCustomerBookings,
	setCustomerStatus,
} = customer_slice.actions;
export default customer_slice.reducer;
