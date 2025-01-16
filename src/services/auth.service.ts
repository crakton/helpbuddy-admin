import { IUserBio } from "@/interfaces/IUser";
import { ILogin, ISignUp } from "@/interfaces/auth/IAuth";
import { login, logout, updateUserBio } from "@/redux/features/auth/auth_slice";
import { TStore, store } from "@/redux/store";
import { TSuccessResponse } from "@/types/auth.types";
import { T_loading_provider } from "@/types/loader.types";
import { handleAuthErrors } from "@/utils/auth.util";
import { AxiosError } from "axios";

export default class Auth {
	private router: any;
	private store: TStore;

	constructor(router: any) {
		this.router = router;
		this.store = store;
	}

	async logIn(payload: ILogin) {
		try {
			const response = await fetch(`/api/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const result = await response.json();
			if (!response.ok) {
				throw new Error(result.message || "Login failed");
			}

			return result;
		} catch (error) {
			console.error("Error during login:", error);
			throw error;
		}
	}

	// async signup(payload: ISignUp) {
	// 	try {
	// 	} catch (error) {
	// 	} finally {
	// 	}
	// }

	async logout() {
		this.router.replace("/");
	}
}
