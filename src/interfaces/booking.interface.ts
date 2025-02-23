import { IService } from "./service.interface";

interface Availability {
	day: string;
	startTime: string;
	endTime: string;
}

export interface IBooking {
	userId: string;
	startTime: string;
	endTime: string;
	serviceId: string;
	name: string;
	status: "completed" | "cancelled" | "pending" | "accepted" | "rejected";
	description: string;
	category: string;
	isRemoteService: boolean;
	isActive: boolean;
	tags: string[];
	duration: number;
	price: number;
	images: string[];
	subCategoryId: string;
	location: [string, string];
	availability: Availability[];
	$id: string;
	$createdAt: string;
	$updatedAt: string;
	$permissions: string[];
	$databaseId: string;
	$collectionId: string;
	service: IService;
}
