import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
	topProviders: [] as any[],
	providers: [] as any[],
	provider: {} as any,
	providerService: [] as any[],
	providerBookings: [] as any[],
};

const provider_slice = createSlice({
	name: "Provider_Slice",
	initialState,
	reducers: {
		setTopProviders: (state, action: PayloadAction<any[]>) => {
			state.topProviders = action.payload;
		},
		setProviders: (state, action: PayloadAction<any[]>) => {
			state.providers = action.payload;
		},
		setProvider: (state, action: PayloadAction<any>) => {
			state.provider = action.payload;
		},
		setProviderServices: (state, action: PayloadAction<any[]>) => {
			state.providerService = action.payload;
		},
		setProviderBookings: (state, action: PayloadAction<any[]>) => {
			state.providerBookings = action.payload;
		},
	},
});

export const {
	setProviders,
	setProvider,
	setTopProviders,
	setProviderServices,
	setProviderBookings,
} = provider_slice.actions;
export default provider_slice.reducer;
