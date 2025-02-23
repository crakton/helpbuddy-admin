import { IService } from "@/interfaces/service.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IServiceCategory {
	$id?: string;
	name: string;
	description?: string;
	parentId?: string;
	isActive: boolean;
	createdAt?: string;
}

// export interface IService {
// 	$id?: string;
// 	name: string;
// 	description: string;
// 	categoryId: string;
// 	subCategoryId?: string;
// 	providerId: string;
// 	price: number;
// 	duration: number;
// 	isVerified: boolean;
// 	isBlocked: boolean;
// 	isActive: boolean;
// 	isRemoteService: boolean;
// 	status: "active" | "inactive" | "draft";
// 	tags: string[];
// 	images: string[];
// 	createdAt?: string;
// 	availability: { day: string; startTime: string; endTime: string }[];
// 	location: string[];
// 	maxParticipants: number;
// }

interface ServicesState {
	loading: boolean;
	services: IService[];
	categories: IServiceCategory[];
	subCategories: IServiceCategory[];
	totalPages: number;
}

const initialState: ServicesState = {
	loading: false,
	services: [],
	categories: [],
	subCategories: [],
	totalPages: 1,
};

const servicesSlice = createSlice({
	name: "services",
	initialState,
	reducers: {
		setServices: (state, action: PayloadAction<IService[]>) => {
			state.services = action.payload;
		},
		setCategories: (state, action: PayloadAction<IServiceCategory[]>) => {
			state.categories = action.payload;
		},
		setSubCategories: (state, action: PayloadAction<IServiceCategory[]>) => {
			state.subCategories = action.payload;
		},
		setTotalPages: (state, action: PayloadAction<number>) => {
			state.totalPages = action.payload;
		},
		verifyService: (state, action: PayloadAction<string>) => {
			const service = state.services.find((s) => s.$id === action.payload);
			if (service) {
				service.isVerified = true;
			}
		},
		toggleBlockService: (state, action: PayloadAction<string>) => {
			const service = state.services.find((s) => s.$id === action.payload);
			if (service) {
				service.isBlocked = !service.isBlocked;
			}
		},
		addCategory: (state, action: PayloadAction<IServiceCategory>) => {
			state.categories.push(action.payload);
		},
		updateCategory: (
			state,
			action: PayloadAction<{ id: string; data: Partial<IServiceCategory> }>
		) => {
			const category = state.categories.find(
				(c) => c.$id === action.payload.id
			);
			if (category) {
				Object.assign(category, action.payload.data);
			}
		},
		deleteCategory: (state, action: PayloadAction<string>) => {
			state.categories = state.categories.filter(
				(c) => c.$id !== action.payload
			);
		},
		addService: (state, action: PayloadAction<IService>) => {
			state.services.push(action.payload);
		},
	},
});

export const {
	setServices,
	setCategories,
	setSubCategories,
	setTotalPages,
	verifyService,
	toggleBlockService,
	addCategory,
	updateCategory,
	deleteCategory,
	addService,
} = servicesSlice.actions;

export default servicesSlice.reducer;
