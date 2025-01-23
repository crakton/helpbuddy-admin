import { AppwriteException } from "appwrite";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

export async function handleAuthErrors(error: unknown): Promise<void> {
	if (error instanceof AppwriteException) {
		// Appwrite specific error handling
		switch (error.code) {
			case 401: // Unauthorized
				toast.error("Invalid credentials", {
					position: "top-center",
					autoClose: 2000,
					theme: "colored",
				});
				redirect("/");

			case 403: // Forbidden
				toast.error("Access denied", {
					position: "top-center",
					autoClose: 2000,
					theme: "colored",
				});
				redirect("/");

			case 404: // Not Found
				toast.error("User not found", {
					position: "top-center",
					autoClose: 2000,
					theme: "colored",
				});
				break;

			case 409: // Conflict
				toast.error("Account already exists", {
					position: "top-center",
					autoClose: 2000,
					theme: "colored",
				});
				break;

			default:
				toast.error(error.message || "An unexpected error occurred", {
					position: "top-center",
					autoClose: 2000,
					theme: "colored",
				});
		}
	} else if (error instanceof Error) {
		// Handle network or unexpected errors
		toast.warn(
			error.message || "Something went wrong. Please try again later.",
			{
				position: "top-center",
				autoClose: 5000,
				theme: "colored",
			}
		);
	} else {
		// Handle unknown errors
		toast.error("An unknown error occurred.", {
			position: "top-center",
			autoClose: 5000,
			theme: "colored",
		});
	}
}
