import appwrite from "@/appwrite-config";
import { store, TStore } from "@/redux/store";
import { handleAuthErrors } from "@/utils/auth.util";
import { ID } from "appwrite";
import { toast } from "react-toastify";

class Auth {
	private store: TStore;

	constructor() {
		this.store = store;
	}
	async login(email: string, password: string) {
		try {
			const session = await appwrite.account.createEmailPasswordSession(
				email,
				password
			);
			toast.success("Logged in successfully");
			const user = await appwrite.account.get();
			return { user, session };
		} catch (error) {
			console.log("errors: ", error);
			await handleAuthErrors(error);
			throw error;
		}
	}

	async logout() {
		try {
			await appwrite.account.deleteSession("current");
			toast.success("Logged out successfully");
		} catch (error) {
			await handleAuthErrors(error);
			throw error;
		}
	}

	async register(payload: {
		name: string;
		email: string;
		password: string;
		role: "admin" | "provider" | "customer";
	}) {
		try {
			const session = await appwrite.account.create(
				ID.unique(),
				payload.email,
				payload.password,
				payload.name
			);
			toast.success("Registered successfully");
			return session;
		} catch (error) {
			await handleAuthErrors(error);
			throw error;
		}
	}
	async verifyEmail(userId: string) {
		try {
			const token = await appwrite.account.createVerification(userId);
			toast.success("Email verified successfully");
			return token;
		} catch (error) {
			await handleAuthErrors(error);
			throw error;
		}
	}
}

const authAPI = new Auth();
export default authAPI;
