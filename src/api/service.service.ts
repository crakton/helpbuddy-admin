import { headers } from "@/constants/http_config";
import {
	IDeleteCategory,
	IService,
	IServiceCategory,
	IServiceSubCategory,
} from "@/interfaces/IService";
import { setLoading } from "@/redux/features/app/loading_slice";
import {
	createService,
	setCategories,
	setServices,
} from "@/redux/features/app/service_slice";
import { setTotalPages } from "@/redux/features/app/util_slice";
import { TStore, store } from "@/redux/store";
import { TErrorResponse, TSuccessResponse } from "@/types/auth.types";
import { T_loading_provider } from "@/types/loader.types";
import { handleAuthErrors } from "@/utils/auth.util";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

export default class Service {
	private store: TStore;

	constructor() {
		this.store = store;
	}

	async getServices(page?: number) {
		try {
		} catch (error) {
			handleAuthErrors(error as AxiosError<TErrorResponse>);
		} finally {
			store.dispatch(setLoading(false));
		}
	}

	async getCategories(page?: number) {
		try {
		} catch (error) {
			handleAuthErrors(error as AxiosError<TErrorResponse>);
		} finally {
			store.dispatch(setLoading(false));
		}
	}

	async verifyService(serviceId: string) {
		try {
		} catch (error) {
			handleAuthErrors(error as AxiosError<TErrorResponse>);
		}
	}

	async blockService(serviceId: string) {
		try {
		} catch (error) {
			handleAuthErrors(error as AxiosError<TErrorResponse>);
		}
	}

	async getCategoriesforCreation() {
		try {
		} catch (error) {
			handleAuthErrors(error as AxiosError<TErrorResponse>);
		}
	}

	async deleteCategory(_id: string) {
		try {
		} catch (error) {
			handleAuthErrors(error as AxiosError<TErrorResponse>);
		}
	}

	async getSubCategories(categoryId: string) {
		try {
		} catch (error) {
			handleAuthErrors(error as AxiosError<TErrorResponse>);
		}
	}

	async createCategory(category: any) {
		try {
		} catch (error) {
			handleAuthErrors(error as AxiosError<TErrorResponse>);
		} finally {
			store.dispatch(setLoading(false));
		}
	}
	async editCategory(payload: any, id: string) {
		try {
		} catch (error) {
			handleAuthErrors(error as AxiosError<TErrorResponse>);
		} finally {
			store.dispatch(setLoading(false));
		}
	}

	async creatService(payload: any, loading_opt: T_loading_provider) {
		try {
		} catch (error) {
			handleAuthErrors(error as AxiosError<TErrorResponse>);
		} finally {
		}
	}
}
