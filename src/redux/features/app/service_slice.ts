import { ExtFile } from "@files-ui/react";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
const initialState = {
	topServices: [] as any[],
	services: [] as any[],
	pendingServices: [] as any[],
	blockedServices: [] as any[],
	unpublishedServices: [] as any[],
	verifiedServices: [] as any[],
	service: {} as any,
	serviceCategories: [] as any[],
	subCategories: [] as any[],
	catId: "" as string,
	catName: "" as string,
	catIcon: [] as any[] | [],
};

const serviceSlice = createSlice({
	name: "Service_Slice",
	initialState,
	reducers: {
		setCatId: (state, action: PayloadAction<string>) => {
			state.catId = action.payload;
		},
		setCatName: (state, action: PayloadAction<string>) => {
			state.catName = action.payload;
		},
		setCatIcon: (state, action: PayloadAction<ExtFile[] | []>) => {
			state.catIcon = action.payload;
		},
		setTopServices: (state, action: PayloadAction<any[]>) => {
			state.topServices = action.payload;
		},
		setServices: (state, action: PayloadAction<any[]>) => {
			state.services = action.payload;
		},
		setBlockedServices: (state, action: PayloadAction<any[]>) => {
			state.blockedServices = action.payload;
		},
		setUnpublishedServices: (state, action: PayloadAction<any[]>) => {
			state.unpublishedServices = action.payload;
		},
		setPendingServices: (state, action: PayloadAction<any[]>) => {
			state.pendingServices = action.payload;
		},
		setVerifiedServices: (state, action: PayloadAction<any[]>) => {
			state.verifiedServices = action.payload;
		},
		setCategories: (state, action: PayloadAction<any[]>) => {
			state.serviceCategories = action.payload;
		},
		setSubCategories: (state, action: PayloadAction<any[]>) => {
			state.subCategories = action.payload;
		},
		createService: (state, action: PayloadAction<any>) => {
			state.services = [action.payload, ...state.services];
		},
	},
});

export const {
	setCatId,
	setCatIcon,
	setCatName,
	setServices,
	setTopServices,
	setCategories,
	setSubCategories,
	createService,
	setPendingServices,
	setBlockedServices,
	setUnpublishedServices,
	setVerifiedServices,
} = serviceSlice.actions;
export default serviceSlice.reducer;
