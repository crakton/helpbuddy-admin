import { IUserBio } from "@/interfaces/IUser";
import { ILogin, ISignUp } from "@/interfaces/auth/IAuth";
import { login, logout, updateUserBio } from "@/redux/features/auth/auth_slice";
import { TStore, store } from "@/redux/store";
import { TSuccessResponse } from "@/types/auth.types";
import { T_loading_provider } from "@/types/loader.types";

export default class Auth {
	private router: any;
	private store: TStore;

	constructor(router: any) {
		this.router = router;
		this.store = store;
	}

	async logIn(payload: ILogin) {
		try {
		} catch (error) {
		} finally {
		}
	}

	async signup(payload: ISignUp) {
		try {
		} catch (error) {
		} finally {
		}
	}
}
