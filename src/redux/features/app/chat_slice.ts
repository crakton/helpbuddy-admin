import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Models } from "appwrite";

const initialState = {
	conversations: [] as any[],
	userConversations: [] as any[],
	activeHeaderInfo: {} as any,
	activeUserConvo: {} as any,
	chatDetails: {},
	users: [] as Models.User<Models.Preferences>[],
	messages: [] as any[],
	userTOChatId: "" as string,
};

const chat_slice = createSlice({
	name: "Chat_Slice",
	initialState,
	reducers: {
		setUserTOChatId: (state, action: PayloadAction<string>) => {
			state.userTOChatId = action.payload;
		},
		setConversations: (state, action: PayloadAction<any[]>) => {
			state.conversations = action.payload;
		},
		setActiveHeaderInfo: (state, action: PayloadAction<any>) => {
			state.activeHeaderInfo = action.payload;
		},
		setActiveUserConvo: (state, action: PayloadAction<any>) => {
			state.activeUserConvo = action.payload;
		},
		setUsers: (
			state,
			action: PayloadAction<Models.User<Models.Preferences>[]>
		) => {
			state.users = action.payload;
		},
		setMessages: (state, action: PayloadAction<any[]>) => {
			state.messages = action.payload;
		},
		createMessage: (state, action: PayloadAction<any>) => {
			state.messages = [...state.messages, action.payload];
		},
	},
});

export const {
	setConversations,
	setUsers,
	setMessages,
	createMessage,
	setActiveHeaderInfo,
	setUserTOChatId,
	setActiveUserConvo,
} = chat_slice.actions;
export default chat_slice.reducer;
