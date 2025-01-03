import { headers } from "@/constants/http_config";
import {
	setProvider,
	setProviderBookings,
	setProviderServices,
	setProviders,
} from "@/redux/features/app/provider_slice";
import { setLoading } from "@/redux/features/app/loading_slice";
import { TStore, store } from "@/redux/store";
import { TErrorResponse, TSuccessResponse } from "@/types/auth.types";
import { handleAuthErrors } from "@/utils/auth.util";
import axios, { AxiosError } from "axios";
import { T_Providers } from "@/types/providers";
import { setTotalPages } from "@/redux/features/app/util_slice";

export default class Provider {
	store: TStore;

	constructor() {
		this.store = store;
	}

	async getProviders(page?: number) {
		try {
		} catch (error) {
			handleAuthErrors(error as AxiosError<TErrorResponse>);
		} finally {
			store.dispatch(setLoading(false));
		}
	}

	async getProviderBookings(providerId: string) {
		try {
		} catch (error) {
			handleAuthErrors(error as AxiosError<TErrorResponse>);
		}
	}

	async getProviderServices(providerId: string) {
		try {
		} catch (error) {
			handleAuthErrors(error as AxiosError<TErrorResponse>);
		} finally {
			store.dispatch(setLoading(false));
		}
	}
}
