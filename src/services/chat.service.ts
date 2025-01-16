import axios, { AxiosError } from "axios";
import { TStore, store } from "../redux/store";
import { TErrorResponse, TSuccessResponse } from "../types/auth.types";
import { headers } from "../constants/http_config";
import {
	setConversations,
	setMessages,
	setUsers,
} from "../redux/features/app/chat_slice";
import { handleAuthErrors } from "../utils/auth.util";
import {
	IConversation,
	IMessage,
	ISendingMessage,
	IUserBio,
} from "@/types/user";
export default class ChatService {
	private store: TStore;

	constructor() {
		this.store = store;
	}

	async getConversations() {
		try {
		} catch (error) {
			handleAuthErrors(error as AxiosError<TErrorResponse>);
		}
	}
	async sendingMessage(payload: { to: string; message: string }) {
		try {
		} catch (error) {
			handleAuthErrors(error as AxiosError<TErrorResponse>);
		}
	}

	async getMessages(conversationId: string) {
		try {
		} catch (error) {
			handleAuthErrors(error as AxiosError<TErrorResponse>);
		}
	}

	async getUsers() {
		try {
		} catch (error) {
			handleAuthErrors(error as AxiosError<TErrorResponse>);
		}
	}
}
