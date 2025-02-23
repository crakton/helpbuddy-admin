export interface ICustomer {
	$id: string;
	$createdAt: string;
	$updatedAt: string;
	fullName: string;
	address: string;
	userId: string;
	country: string;
	email: string;
	role: string;
	phone: string;
	totalBookings?: number;
}
