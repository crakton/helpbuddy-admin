import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Account, Models } from "appwrite";

interface AuthState {
	user: Models.User<Models.Preferences> | null;
	session: Models.Session | null;
	isAuthenticated: boolean;
	loading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	user: null,
	session: null,
	isAuthenticated: false,
	loading: false,
	error: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setSession(state, action: PayloadAction<Models.Session>) {
			state.session = action.payload;
		},
		loginStart(state) {
			state.loading = true;
			state.error = null;
		},
		loginSuccess(
			state,
			action: PayloadAction<Models.User<Models.Preferences>>
		) {
			state.user = action.payload;
			state.isAuthenticated = true;
			state.loading = false;
		},
		loginFailure(state, action: PayloadAction<string>) {
			state.loading = false;
			state.error = action.payload;
		},
		logout(state) {
			state.user = null;
			state.isAuthenticated = false;
			state.session = null;
		},
	},
});

export const { loginStart, loginSuccess, loginFailure, logout, setSession } =
	authSlice.actions;
export default authSlice.reducer;
