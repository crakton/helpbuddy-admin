import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Loader } from "lucide-react";

const withAuth = (WrappedComponent: React.ComponentType) => {
	const AuthWrapper = (props: any) => {
		const router = useRouter();
		const isAuthenticated = useSelector(
			(state: RootState) => state.auth.isAuthenticated
		);

		useEffect(() => {
			if (!isAuthenticated) {
				router.replace("/"); // Redirect to home if not authenticated
			}
		}, [isAuthenticated, router]);

		// Render the component only if authenticated
		if (!isAuthenticated) {
			return (
				<div
					className="
			w-full h-full bg-black/20 static t-0 l-0
			"
				>
					<div className="self-center place-self-center">
						<Loader className="animate-spin repeat-infinite" size={36} />
					</div>
				</div>
			);
		}

		return <WrappedComponent {...props} />;
	};

	return AuthWrapper;
};

export default withAuth;
