export interface IService {
	$id: string;
	name: string;
	description: string;
	price: number;
	duration: number;
	categoryId: string;
	subcategoryId: string;
	isVerified: boolean;
	isBlocked: boolean;
	isActive: boolean;
	providerId: string;
	images: string[];
	availability: {
		day: string;
		startTime: string;
		endTime: string;
	}[];
	location?: number[];
	isRemoteService: boolean;
	maxParticipants: number;
	cancellationPolicy: "flexible" | "moderate" | "strict";
	status: "active" | "inactive" | "draft" | "pending";
	tags: string[];
}
