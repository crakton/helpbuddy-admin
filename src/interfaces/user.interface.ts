export interface IUser {
	$id: string;
	name: string;
	email: string;
	profileImage?: string;
	role: "admin" | "service_provider" | "customer";
	phone?: string;
	location?: {
		latitude: number;
		longitude: number;
	};
}
