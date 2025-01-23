import appwrite from "@/appwrite-config";
import { handleAuthErrors } from "@/utils/auth.util";
import { toast } from "react-toastify";

export default class Auth {
	async login(payload: { email: string; password: string }) {
		try {
			const session = await appwrite.account.createEmailPasswordSession(
				payload.email,
				payload.password
			);
			toast.success("Logged in successfully");
			return session;
		} catch (error) {
			await handleAuthErrors(error);
			throw error;
		}
	}

	async logout() {}
}
