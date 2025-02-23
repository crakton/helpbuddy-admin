import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "@/features/authSlice";
import bookingsReducer from "@/features/bookingSlice";
import dashboardReducer from "@/features/dashboardSlice";
import servicesReducer from "@/features/serviceSlice";
import customersReducer from "@/features/customerSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
// import profileReducer from "@/features/profile/profileSlice";

const rootReducer = combineReducers({
	auth: authReducer,
	bookings: bookingsReducer,
	dashboard: dashboardReducer,
	services: servicesReducer,
	customers: customersReducer,
});

const persistConfig = {
	key: "root",
	storage,
	whitelist: ["auth"], // Persist only auth slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type TStore = typeof store;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
