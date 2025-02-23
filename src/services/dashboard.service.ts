import authManger from "@/services/auth.service";
import { bookingManager } from "@/services/booking.service";
import { serviceManager } from "@/services/service.service";
import { customerManager } from "@/services/customer.service";
import { IBooking } from "@/interfaces/booking.interface";

export const getDashboardStatistics = async () => {
	try {
		const [bookings, services, customers] = await Promise.all([
			bookingManager.getBookings(),
			serviceManager.getServices(),
			customerManager.getCustomers(),
		]);

		return {
			// totalUsers: users.length,
			// activeUsers: users.filter(user => user.active).length,
			totalBookings: bookings.bookings.length,
			completedBookings: (bookings.bookings as unknown as IBooking[]).filter(
				(booking) => booking.status === "completed"
			).length,
			totalServices: services.services.total,
			mostPopularService: services.services.documents.sort(
				(a, b) => b.bookings - a.bookings
			)[0],
			totalRevenue: (bookings.bookings as unknown as IBooking[]).reduce(
				(acc, booking) => acc + booking?.price,
				0
			),
			retentionRate:
				(customers.customers.filter((c: any) => c.repeatCustomer).length /
					customers.customers.length) *
				100,
			avgBookingDuration:
				(bookings.bookings as unknown as IBooking[]).reduce(
					(acc, b) => acc + b.duration,
					0
				) / bookings.bookings.length,
		};
	} catch (error) {
		console.error("Error fetching dashboard statistics:", error);
		return null;
	}
};
