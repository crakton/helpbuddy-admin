"use client";

import React, { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { customerManager } from "@/services/customer.service";
import { setCustomers } from "@/features/customerSlice";
import { ICustomer } from "@/interfaces/customer.interface";
import Pagination from "../_components/Pagination";

const CustomersPage = () => {
	const searchParams = useSearchParams();
	const dispatch = useAppDispatch();
	const { customers, stats, totalPages } = useAppSelector(
		(state) => state.customers
	);
	const page = searchParams.get("page") || "1";
	const fetchCustomers = useCallback(async () => {
		try {
			const { customers, totalPages } = await customerManager.getCustomers(
				Number(page)
			);
			dispatch(
				setCustomers({
					customers: customers as unknown as ICustomer[],
					totalPages,
				})
			);
		} catch (error) {}
	}, []);

	useEffect(() => {
		fetchCustomers();
	}, [fetchCustomers]);

	return (
		<div className="container mx-auto p-6 space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="text-2xl font-bold">Customers</CardTitle>
					{/* <Button className="flex items-center gap-2">
						<UserPlus size={20} />
						Add Customer
					</Button> */}
				</CardHeader>

				<CardContent>
					{/* Search Bar */}
					<div className="relative mb-6">
						<Search
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
							size={20}
						/>
						<input
							className="pl-10 w-full"
							placeholder="Search customers by name, email, or phone..."
						/>
					</div>

					{/* Customers Table */}
					<div className="border rounded-lg overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Phone</TableHead>
									<TableHead>Total Bookings</TableHead>
									{/* 	<TableHead>Status</TableHead> */}
									{/* <TableHead className="text-right">Actions</TableHead> */}
								</TableRow>
							</TableHeader>
							<TableBody>
								{customers.map((customer) => (
									<TableRow key={customer.$id}>
										<TableCell className="font-medium">
											{customer.fullName}
										</TableCell>
										<TableCell>{customer.email}</TableCell>
										<TableCell>{customer.phone}</TableCell>
										<TableCell>{customer.totalBookings}</TableCell>
										{/* <TableCell>
											<span
												className={`px-2 py-1 rounded-full text-xs ${
													customer?.status === "active"
														? "bg-green-100 text-green-800"
														: "bg-gray-100 text-gray-800"
												}`}
											>
												{customer.status}
											</span>
										</TableCell> */}
										{/* <TableCell className="text-right">
											<Button variant="ghost" size="sm">
												View Details
											</Button>
										</TableCell> */}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{/* Pagination */}
					<div className="mt-6 flex justify-center">
						<Pagination page={page} totalPages={totalPages} />
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default CustomersPage;
