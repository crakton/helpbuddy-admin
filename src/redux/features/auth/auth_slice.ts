import { IUser } from "@/interfaces/user.interface";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Models } from "appwrite";

const initialState = {
	isAuthenticated: false,
	userBio: {} as Models.User<Models.Preferences>,
	session: {} as Models.Session,
};

const authSlice = createSlice({
	name: "Auth_Slice",
	initialState,
	reducers: {
		login: (state) => {
			state.isAuthenticated = true;
		},
		logout: (state) => {
			state.isAuthenticated = false;
			state.session = {} as Models.Session;
		},
		updateUserBio: (
			state,
			action: PayloadAction<Models.User<Models.Preferences>>
		) => {
			state.userBio = action.payload;
		},
		setSession: (state, action: PayloadAction<Models.Session>) => {
			state.session = action.payload;
		},
	},
});

export const { login, logout, updateUserBio, setSession } = authSlice.actions;
export default authSlice.reducer;
