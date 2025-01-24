import { TStore, store } from "@/redux/store";
import { handleAuthErrors } from "@/utils/auth.util";
import { toast } from "react-toastify";

export default class Reviews {
	private store: TStore;

	constructor() {
		this.store = store;
	}

	async getReviews() {
		try {
		} catch (error) {
			handleAuthErrors(error);
		} finally {
		}
	}
}
