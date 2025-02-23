import { TStore, store } from "../redux/store";
import { handleAuthErrors } from "../lib/auth.util";
class ChatService {
	private store: TStore;

	constructor() {
		this.store = store;
	}

	async getConversations() {
		try {
		} catch (error) {
			handleAuthErrors(error);
		}
	}
	async sendingMessage(payload: { to: string; message: string }) {
		try {
		} catch (error) {
			handleAuthErrors(error);
		}
	}

	async getMessages(conversationId: string) {
		try {
		} catch (error) {
			handleAuthErrors(error);
		}
	}

	async getUsers() {
		try {
		} catch (error) {
			handleAuthErrors(error);
		}
	}
}

const chatAPI = new ChatService();

export default chatAPI;
