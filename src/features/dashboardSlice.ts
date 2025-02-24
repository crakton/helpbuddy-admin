import { IBooking } from "@/interfaces/booking.interface";
import { IService } from "@/interfaces/service.interface";
import { IProvider } from "@/services/provider.service";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DashboardState {
	cards: { title: string; value: number }[];
	bookingSummary: {
		pending: number;
		confirmed: number;
		completed: number;
		cancelled: number;
	};
	stats: {
		totalRevenue: number;
		avgBookingValue: number;
		bookingGrowth: number;
	};
	topServices: IService[];
	topProviders: IProvider[];
	recentBookings: (IBooking & { provider: IProvider; service: IService })[];
	loading: Record<string, boolean>;
	error: Record<string, string | null>;
}

const initialState: DashboardState = {
	cards: [],
	bookingSummary: { pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
	stats: { totalRevenue: 0, avgBookingValue: 0, bookingGrowth: 0 },
	topServices: [],
	topProviders: [],
	recentBookings: [],
	loading: {
		cards: false,
		summary: false,
		stats: false,
		topServices: false,
		topProviders: false,
		recentBookings: false,
	},
	error: {},
};

const dashboardSlice = createSlice({
	name: "dashboard",
	initialState,
	reducers: {
		setLoading(state, action: PayloadAction<{ key: string; value: boolean }>) {
			state.loading[action.payload.key] = action.payload.value;
		},
		setError(
			state,
			action: PayloadAction<{ key: string; value: string | null }>
		) {
			state.error[action.payload.key] = action.payload.value;
		},
		setDashboardCards(
			state,
			action: PayloadAction<{ title: string; value: number }[]>
		) {
			state.cards = action.payload;
		},
		setBookingSummary(
			state,
			action: PayloadAction<DashboardState["bookingSummary"]>
		) {
			state.bookingSummary = action.payload;
		},
		setDashboardStats(state, action: PayloadAction<DashboardState["stats"]>) {
			state.stats = action.payload;
		},
		setTopServices(state, action: PayloadAction<IService[]>) {
			state.topServices = action.payload;
		},
		setTopProviders(state, action: PayloadAction<IProvider[]>) {
			state.topProviders = action.payload;
		},
		setRecentBookings(
			state,
			action: PayloadAction<DashboardState["recentBookings"]>
		) {
			state.recentBookings = action.payload;
		},
	},
});

export const {
	setLoading,
	setError,
	setDashboardCards,
	setBookingSummary,
	setDashboardStats,
	setTopServices,
	setTopProviders,
	setRecentBookings,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;

// Async action handlers (to be used in components or middleware)
export const fetchDashboardData =
	(key: keyof DashboardState, fetchFunction: () => Promise<any>) =>
	async (dispatch: any) => {
		try {
			dispatch(setLoading({ key, value: true }));
			const data = await fetchFunction();
			switch (key) {
				case "cards":
					dispatch(setDashboardCards(data));
					break;
				case "bookingSummary":
					dispatch(setBookingSummary(data));
					break;
				case "stats":
					dispatch(setDashboardStats(data));
					break;
				case "topServices":
					dispatch(setTopServices(data));
					break;
				case "topProviders":
					dispatch(setTopProviders(data));
					break;
				case "recentBookings":
					dispatch(setRecentBookings(data));
					break;
			}
		} catch (error: any) {
			dispatch(
				setError({ key, value: error.message || "Failed to fetch data" })
			);
		} finally {
			dispatch(setLoading({ key, value: false }));
		}
	};
