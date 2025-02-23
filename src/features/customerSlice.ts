import { ICustomer } from "@/interfaces/customer.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomersState {
	customers: ICustomer[];
	totalPages: number;
	loading: boolean;
	error: string | null;
	stats: {
		active: number;
		inactive: number;
		total: number;
	};
	selectedCustomer: ICustomer | null;
}

const initialState: CustomersState = {
	customers: [],
	totalPages: 1,
	loading: false,
	error: null,
	stats: {
		active: 0,
		inactive: 0,
		total: 0,
	},
	selectedCustomer: null,
};

const customersSlice = createSlice({
	name: "customers",
	initialState,
	reducers: {
		setCustomers: (
			state,
			action: PayloadAction<{
				customers: ICustomer[];
				totalPages: number;
			}>
		) => {
			state.customers = action.payload.customers;
			state.totalPages = action.payload.totalPages;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		setCustomerStats: (
			state,
			action: PayloadAction<{
				active: number;
				inactive: number;
				total: number;
			}>
		) => {
			state.stats = action.payload;
		},
		addCustomer: (state, action: PayloadAction<ICustomer>) => {
			state.customers.unshift(action.payload);
		},
		updateCustomer: (
			state,
			action: PayloadAction<{
				customerId: string;
				updates: Partial<ICustomer>;
			}>
		) => {
			state.customers = state.customers.map((customer) =>
				customer.$id === action.payload.customerId
					? { ...customer, ...action.payload.updates }
					: customer
			);
		},
		deleteCustomer: (state, action: PayloadAction<string>) => {
			state.customers = state.customers.filter(
				(customer) => customer.$id !== action.payload
			);
		},
		setSelectedCustomer: (state, action: PayloadAction<ICustomer | null>) => {
			state.selectedCustomer = action.payload;
		},
	},
});

export const {
	setCustomers,
	setLoading,
	setError,
	setCustomerStats,
	addCustomer,
	updateCustomer,
	deleteCustomer,
	setSelectedCustomer,
} = customersSlice.actions;

export default customersSlice.reducer;
