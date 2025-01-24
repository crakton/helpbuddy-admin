import axios, { AxiosError } from "axios";
import { TStore, store } from "../redux/store";
import { handleAuthErrors } from "../utils/auth.util";
import { setLoading } from "@/redux/features/app/loading_slice";

export default class Customers {
	private store: TStore;

	constructor() {
		this.store = store;
	}

	async getAllCustomers(page?: number) {
		try {
		} catch (error) {
		} finally {
		}
	}
	async getCustomersCard(customerId: string) {
		try {
		} catch (error) {
			handleAuthErrors(error);
		}
	}
	async getCustomerBookings(customerId: string) {
		try {
		} catch (error) {
			handleAuthErrors(error);
		} finally {
			store.dispatch(setLoading(false));
		}
	}
}
