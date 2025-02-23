import { TStore, store } from "@/redux/store";
import { handleAuthErrors } from "@/lib/auth.util";
export default class Transactions {
	private store: TStore;

	constructor() {
		this.store = store;
	}

	async getOtherTransactions() {
		try {
		} catch (error) {
			handleAuthErrors(error);
		} finally {
		}
	}
	async getBookingsTransactions() {
		try {
		} catch (error) {
			handleAuthErrors(error);
		} finally {
		}
	}
}
