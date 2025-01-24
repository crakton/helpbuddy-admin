import { setTotalPages } from "@/redux/features/app/util_slice";
import { TStore, store } from "@/redux/store";
import { handleAuthErrors } from "@/utils/auth.util";
import { toast } from "react-toastify";

export default class Service {
	private store: TStore;

	constructor() {
		this.store = store;
	}

	async getServices(page?: number) {
		try {
		} catch (error) {
			handleAuthErrors(error);
		} finally {
		}
	}

	async getCategories(page?: number) {
		try {
		} catch (error) {
			handleAuthErrors(error);
		} finally {
		}
	}

	async verifyService(serviceId: string) {
		try {
		} catch (error) {
			handleAuthErrors(error);
		}
	}

	async blockService(serviceId: string) {
		try {
		} catch (error) {
			handleAuthErrors(error);
		}
	}

	async getCategoriesforCreation() {
		try {
		} catch (error) {
			handleAuthErrors(error);
		}
	}

	async deleteCategory(_id: string) {
		try {
		} catch (error) {
			handleAuthErrors(error);
		}
	}

	async getSubCategories(categoryId: string) {
		try {
		} catch (error) {
			handleAuthErrors(error);
		}
	}

	async createCategory(category: any) {
		try {
		} catch (error) {
			handleAuthErrors(error);
		} finally {
		}
	}
	async editCategory(payload: any, id: string) {
		try {
		} catch (error) {
			handleAuthErrors(error);
		} finally {
		}
	}

	async creatService(payload: any, loading_opt: any) {
		try {
		} catch (error) {
			handleAuthErrors(error);
		} finally {
		}
	}
}
