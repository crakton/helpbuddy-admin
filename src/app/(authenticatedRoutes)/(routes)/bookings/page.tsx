"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Ban } from "lucide-react";

import {
	Calendar,
	Clock,
	ChevronLeft,
	ChevronRight,
	AlertCircle,
	CheckCircle2,
	XCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { bookingManager } from "@/services/booking.service";
import {
	setBookings,
	setBookingStats,
	setError,
	setLoading,
	updateBookingStatus,
} from "@/features/bookingSlice";
import { IBooking } from "@/interfaces/booking.interface";

const BookingsPage = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const {
		items: bookings,
		loading,
		error,
		stats,
		totalPages,
	} = useAppSelector((state) => state.bookings);
	const [activeTab, setActiveTab] = useState("all");
	const [confirmDialog, setConfirmDialog] = useState({
		open: false,
		action: undefined as "accept" | "reject" | "complete" | undefined,
		booking: null as IBooking | null,
	});

	const page = parseInt(searchParams.get("page") || "1");

	const fetchBookings = useCallback(async () => {
		try {
			dispatch(setLoading(true));
			// Simulate API call with the provided data
			const { bookings, totalPages } = await bookingManager.getBookings();

			// const stats = await bookingManager.getBookingStats();
			const stats = {
				pending: 0,
				accepted: 0,
				completed: 0,
				cancelled: 0,
			};
			const pending = (bookings as unknown as IBooking[]).filter(
				(booking) => booking?.status.toLowerCase() === "pending"
			).length;
			const accepted = (bookings as unknown as IBooking[]).filter(
				(booking) => booking?.status.toLowerCase() === "accepted"
			).length;
			const completed = (bookings as unknown as IBooking[]).filter(
				(booking) => booking?.status.toLowerCase() === "completed"
			).length;
			const cancelled = (bookings as unknown as IBooking[]).filter(
				(booking) => booking?.status.toLowerCase() === "cancelled"
			).length;
			stats.pending = pending;
			stats.accepted = accepted;
			stats.completed = completed;
			stats.cancelled = cancelled;

			console.log("status stats", stats);
			console.log("bookings", bookings);

			dispatch(
				setBookings({ bookings: bookings as unknown as IBooking[], totalPages })
			);
			dispatch(setBookingStats(stats));
		} catch (err) {
			dispatch(setError("Failed to fetch bookings"));
		} finally {
			dispatch(setLoading(false));
		}
	}, [dispatch]);

	useEffect(() => {
		fetchBookings();
	}, [fetchBookings]);

	const handleStatusUpdate = async (
		bookingId: string,
		newStatus: IBooking["status"]
	) => {
		setConfirmDialog({ open: false, action: undefined, booking: null });

		try {
			dispatch(setLoading(true));

			// Call the booking service to update the status
			await bookingManager.updateBookingStatus(bookingId, newStatus);

			// Update the local state through Redux
			dispatch(updateBookingStatus({ bookingId, status: newStatus }));

			// Refresh the booking stats
			const updatedBookings = bookings.map((booking) =>
				booking.$id === bookingId ? { ...booking, status: newStatus } : booking
			);

			const newStats = {
				pending: updatedBookings.filter(
					(b) => b.status.toLowerCase() === "pending"
				).length,
				accepted: updatedBookings.filter(
					(b) => b.status.toLowerCase() === "accepted"
				).length,
				completed: updatedBookings.filter(
					(b) => b.status.toLowerCase() === "completed"
				).length,
				cancelled: updatedBookings.filter(
					(b) => b.status.toLowerCase() === "cancelled"
				).length,
			};

			dispatch(setBookingStats(newStats));
		} catch (error) {
			dispatch(setError("Failed to update booking status"));
		} finally {
			dispatch(setLoading(false));
		}
	};

	const filteredBookings =
		activeTab === "all"
			? bookings
			: bookings.filter(
					(booking) => booking.status.toLowerCase() === activeTab
			  );

	const statusColors: { [key: string]: string } = {
		pending: "bg-yellow-100 text-yellow-800",
		accepted: "bg-blue-100 text-blue-800",
		completed: "bg-green-100 text-green-800",
		cancelled: "bg-red-100 text-red-800",
	};

	if (error) {
		return (
			<Alert variant="destructive" className="mx-6 mt-6">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="p-6 space-y-6">
				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
					<div className="flex gap-4">
						{Object.entries(stats).map(([key, value]) => (
							<Card
								key={key}
								className="bg-white shadow-sm hover:shadow-md transition-shadow"
							>
								<CardHeader className="p-4">
									<CardTitle className="text-sm font-medium text-gray-500 capitalize">
										{key}
									</CardTitle>
									<p className="text-2xl font-bold text-gray-900">{value}</p>
								</CardHeader>
							</Card>
						))}
					</div>
				</div>

				<Card className="bg-white shadow-sm">
					<CardHeader className="border-b">
						<div className="flex gap-6">
							{["all", "pending", "accepted", "completed", "cancelled"].map(
								(tab: string) => (
									<Button
										key={tab}
										variant="ghost"
										className={`${
											activeTab === tab
												? "border-b-2 border-primary text-primary"
												: "text-gray-600"
										} capitalize`}
										onClick={() => setActiveTab(tab)}
									>
										{tab} ({stats[tab]})
									</Button>
								)
							)}
						</div>
					</CardHeader>
					<CardContent className="p-0">
						{loading ? (
							<div className="p-8 text-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
								<p className="mt-4 text-gray-600">Loading bookings...</p>
							</div>
						) : filteredBookings.length === 0 ? (
							<div className="p-8 text-center">
								<p className="text-gray-600">No bookings found</p>
							</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Service</TableHead>
										<TableHead>Schedule</TableHead>
										<TableHead>Price</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredBookings.map((booking) => (
										<TableRow key={booking.$id} className="hover:bg-gray-50">
											<TableCell>
												<div className="font-medium">{booking.name}</div>
												<div className="text-sm text-gray-500">
													{booking.description}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2 text-sm">
													<Calendar className="h-4 w-4" />
													<span>
														{format(
															new Date(booking.$createdAt),
															"MMM dd, yyyy"
														)}
													</span>
													<Clock className="h-4 w-4 ml-2" />
													<span>
														{booking.startTime} - {booking.endTime}
													</span>
												</div>
											</TableCell>
											<TableCell>
												<div className="font-medium">${booking.price}</div>
											</TableCell>
											<TableCell>
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${
														statusColors[booking.status.toLowerCase()]
													}`}
												>
													{booking.status}
												</span>
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" className="h-8 w-8 p-0">
															<span className="sr-only">Open menu</span>
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														{booking.status.toLowerCase() === "pending" && (
															<>
																<DropdownMenuItem
																	onClick={() =>
																		setConfirmDialog({
																			open: true,
																			action: "accept",
																			booking,
																		})
																	}
																	className="text-blue-600"
																>
																	<CheckCircle2 className="mr-2 h-4 w-4" />
																	Accept Booking
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() =>
																		setConfirmDialog({
																			open: true,
																			action: "reject",
																			booking,
																		})
																	}
																	className="text-red-600"
																>
																	<XCircle className="mr-2 h-4 w-4" />
																	Reject Booking
																</DropdownMenuItem>
															</>
														)}

														{booking.status.toLowerCase() === "accepted" && (
															<DropdownMenuItem
																onClick={() =>
																	setConfirmDialog({
																		open: true,
																		action: "complete",
																		booking,
																	})
																}
																className="text-green-600"
															>
																<CheckCircle2 className="mr-2 h-4 w-4" />
																Mark as Completed
															</DropdownMenuItem>
														)}

														{booking.status.toLowerCase() === "completed" && (
															<DropdownMenuItem
																disabled
																className="text-gray-400"
															>
																<Clock className="mr-2 h-4 w-4" />
																Booking Completed
															</DropdownMenuItem>
														)}

														{booking.status.toLowerCase() === "cancelled" && (
															<DropdownMenuItem
																disabled
																className="text-gray-400"
															>
																<Ban className="mr-2 h-4 w-4" />
																Booking Cancelled
															</DropdownMenuItem>
														)}

														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() => {
																// Add view details functionality
																console.log(
																	"View booking details",
																	booking.$id
																);
															}}
														>
															View Details
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>

				{totalPages > 1 && (
					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-700">
							Page {page} of {totalPages}
						</p>
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => router.push(`?page=${page - 1}`)}
								disabled={page === 1}
							>
								<ChevronLeft className="h-4 w-4 mr-1" />
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => router.push(`?page=${page + 1}`)}
								disabled={page === totalPages}
							>
								Next
								<ChevronRight className="h-4 w-4 ml-1" />
							</Button>
						</div>
					</div>
				)}
			</div>

			<Dialog
				open={confirmDialog.open}
				onOpenChange={() =>
					setConfirmDialog({ open: false, action: undefined, booking: null })
				}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Action</DialogTitle>
						<DialogDescription>
							Are you sure you want to {confirmDialog.action} this booking?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() =>
								setConfirmDialog({
									open: false,
									action: undefined,
									booking: null,
								})
							}
						>
							Cancel
						</Button>
						<Button
							variant={
								confirmDialog.action === "reject" ? "destructive" : "default"
							}
							onClick={() =>
								handleStatusUpdate(
									confirmDialog.booking?.$id as string,
									confirmDialog.action === "accept"
										? "accepted"
										: confirmDialog.action === "reject"
										? "cancelled"
										: "completed"
								)
							}
						>
							Confirm
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default BookingsPage;
