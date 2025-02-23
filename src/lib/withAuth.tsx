import { useEffect, useState } from "react";
import { redirect, RedirectType, useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import authAPI from "@/services/auth.service";
import { useAppDispatch, useAppSelector } from "./store";

const withAuth = (WrappedComponent: React.ComponentType) => {
	const AuthWrapper = (props: any) => {
		const dispatch = useAppDispatch();
		const isAuthenticated = useAppSelector(
			(state) => state.auth.isAuthenticated
		);
		const [loading, setLoading] = useState(true);

		useEffect(() => {
			const checkSession = async () => {
				try {
					const isSessionActive = await authAPI.checkSession();
					if (!isSessionActive && !isAuthenticated) {
						redirect("/", RedirectType.replace);
					}
				} catch (error) {
				} finally {
					setLoading(false);
				}
			};

			checkSession();
		}, [dispatch, isAuthenticated]);

		if (loading) {
			return (
				<div className="w-full h-full bg-black/20 flex items-center justify-center">
					<Loader className="animate-spin" size={36} />
				</div>
			);
		}

		if (!isAuthenticated) {
			redirect("/", RedirectType.replace);
		}

		return <WrappedComponent {...props} />;
	};

	return AuthWrapper;
};

export default withAuth;
