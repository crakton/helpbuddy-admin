import { setLoading } from "@/redux/features/app/loading_slice";
import { TStore, store } from "@/redux/store";
import { handleAuthErrors } from "@/utils/auth.util";
import axios, { AxiosError } from "axios";
import { setTotalPages } from "@/redux/features/app/util_slice";

export default class Provider {
	store: TStore;

	constructor() {
		this.store = store;
	}

	async getProviders(page?: number) {
		try {
		} catch (error) {
			handleAuthErrors(error);
		} finally {
			store.dispatch(setLoading(false));
		}
	}

	async getProviderBookings(providerId: string) {
		try {
		} catch (error) {
			handleAuthErrors(error);
		}
	}

	async getProviderServices(providerId: string) {
		try {
		} catch (error) {
			handleAuthErrors(error);
		} finally {
		}
	}
}
