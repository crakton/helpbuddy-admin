export interface IBooking {
	$id: string;
	serviceId: string;
	customerId: string;
	providerId: string;
	date: string;
	startTime: string;
	endTime: string;
	status: "pending" | "confirmed" | "completed" | "cancelled";
	totalAmount: number;
	participants: number;
}
