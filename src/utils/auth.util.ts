import { redirect } from "next/navigation";
import { toast } from "react-toastify";

type TErrorResponse = {
	success: boolean;
	message: string;
};

export async function handleAuthErrors(error: unknown): Promise<void> {
	if (error instanceof Response) {
		// If the error is a Response object, handle it
		const errorData: TErrorResponse = await error.json();

		// Handle specific error messages
		if (
			errorData.message === "Invalid credentials" ||
			errorData.message === "Restricted privileges" ||
			errorData.message === "User not found"
		) {
			toast.error(errorData.message, {
				position: "top-center",
				autoClose: 2000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});

			// Redirect to the login page for invalid credentials
			if (
				errorData.message === "Invalid credentials" ||
				errorData.message === "Restricted privileges"
			) {
				redirect("/");
			}

			return;
		}

		// Handle other general errors
		toast.error(errorData.message || "An unexpected error occurred", {
			position: "top-center",
			autoClose: 2000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
		});
	} else if (error instanceof Error) {
		// Handle network errors or unexpected errors
		toast.warn(
			error.message || "Something went wrong. Please try again later.",
			{
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			}
		);
	} else {
		// Handle unknown errors
		toast.error("An unknown error occurred.", {
			position: "top-center",
			autoClose: 5000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
		});
	}
}

export async function fetchData(
	endpoint: string,
	options?: RequestInit
): Promise<any> {
	try {
		const response = await fetch(endpoint, options);

		if (!response.ok) {
			throw response; // Throw the Response object for error handling
		}

		return await response.json(); // Parse and return the JSON data
	} catch (error) {
		await handleAuthErrors(error); // Handle errors in the catch block
		throw error; // Rethrow the error for further debugging if necessary
	}
}
