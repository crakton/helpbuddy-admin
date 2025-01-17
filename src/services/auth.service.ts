import { IUserBio } from "@/interfaces/IUser";
import { ILogin } from "@/interfaces/auth/IAuth";
import { fetchData } from "@/utils/auth.util";
import { toast } from "react-toastify";

export default class Auth {
	async logIn(payload: ILogin) {
		const data = await fetchData("/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		toast.success("Login successful!", {
			position: "top-center",
			autoClose: 2000,
			theme: "colored",
		});

		return data.user as IUserBio;
	}

	async logout() {}
}
