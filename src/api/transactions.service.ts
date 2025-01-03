import { headers } from "@/constants/http_config";
import { setLoading } from "@/redux/features/app/loading_slice";
import {
	setBookingsTransactions,
	setOtherTransactions,
} from "@/redux/features/app/transactions_slice";
import { TStore, store } from "@/redux/store";
import { TErrorResponse, TSuccessResponse } from "@/types/auth.types";
import { handleAuthErrors } from "@/utils/auth.util";
import axios, { AxiosError } from "axios";

export default class Transactions {
	private store: TStore;

	constructor() {
		this.store = store;
	}

	async getOtherTransactions() {
		try {
		} catch (error) {
			handleAuthErrors(error as AxiosError<TErrorResponse>);
		} finally {
		}
	}
	async getBookingsTransactions() {
		try {
		} catch (error) {
			handleAuthErrors(error as AxiosError<TErrorResponse>);
		} finally {
		}
	}
}
