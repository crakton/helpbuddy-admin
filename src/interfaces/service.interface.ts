export interface IService {
	$id: string;
	name: string;
	description: string;
	price: number;
	duration: number;
	categoryId: string;
	subcategoryId: string;
	providerId: string;
	images: string[];
	availability: {
		day: string;
		startTime: string;
		endTime: string;
	}[];
	location?: {
		latitude: number;
		longitude: number;
	};
	isRemoteService: boolean;
	maxParticipants: number;
	cancellationPolicy: "flexible" | "moderate" | "strict";
	status: "active" | "inactive" | "pending";
	tags: string[];
}
