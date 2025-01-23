import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
	isAuthenticated: false,
	userBio: {},
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
		},
		updateUserBio: (state, action: PayloadAction<{}>) => {
			state.userBio = action.payload;
		},
	},
});

export const { login, logout, updateUserBio } = authSlice.actions;
export default authSlice.reducer;
