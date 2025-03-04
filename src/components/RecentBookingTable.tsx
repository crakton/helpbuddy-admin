"use client";

import React, { FC, memo, useEffect, useMemo, useState } from "react";
import {
	ColumnDef,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { MdDeleteOutline, MdRemoveRedEye } from "react-icons/md";
import Image from "next/image";
import { imgs } from "@/constants/images";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { useSelector } from "react-redux";
import { ImSpinner3 } from "react-icons/im";

interface RecentBookingTableProps {
	loadingRecentBookings: boolean;
	recentBookings: any;
}

const RecentBookingTable: FC<RecentBookingTableProps> = ({
	loadingRecentBookings,
}) => {
	const [rowSelection, setRowSelection] = useState({});
	const [data, setData] = useState<any[]>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const assignUniqueIds = (data: any[]): any[] => {
		// Create a new array to store the updated data
		const updatedData: any[] = [];
		// Assign unique IDs to each data object
		let uniqueId = 1;
		for (const serviceCategory of data) {
			updatedData.push({
				...serviceCategory,
				id: uniqueId++,
			});
		}
		return updatedData;
	};

	useEffect(() => {
		const updatedDataWithIds = assignUniqueIds([]);
		setData(updatedDataWithIds);
	}, []);

	const columns = useMemo<ColumnDef<any>[]>(
		() => [
			{
				accessorKey: "id",
				cell: ({ row }) => (
					<div key={row.id} className="flex gap-4 items-center">
						<span className=" text-slate-800 text-xs">#{row.original.id}</span>
					</div>
				),
				header: () => <span className="text-sm text-[#7C7C7C]">ID</span>,
			},
			{
				accessorKey: "bookingdate",
				cell: ({ row }) => {
					const createdAtDate = new Date(row.original.createdAt);
					const year = createdAtDate.getFullYear();
					const day = createdAtDate.getDate();
					const monthIndex = createdAtDate.getMonth(); // Months are zero-indexed
					const month = new Date(year, monthIndex).toLocaleString("en-US", {
						month: "short",
					});

					const timeString = createdAtDate.toLocaleTimeString("en-US", {
						hour: "numeric",
						minute: "numeric",
						hour12: true,
					});
					return (
						<div className="flex flex-col justify-start items-start">
							<span className="text-afruna-blue text-xs">{`${day} ${month}, ${year}`}</span>
							<span className=" text-afruna-blue text-xs">{timeString}</span>
						</div>
					);
				},
				header: () => (
					<span className="text-sm text-[#7C7C7C]">Booking Date</span>
				),
			},
			{
				accessorKey: "provider",
				cell: ({ row }) => (
					<div key={row.id} className="flex gap-2 items-center">
						<div className=" relative overflow-hidden rounded-full w-[35px] h-[35px] flex justify-center items-center">
							{row.original?.providerId?.avatar ? (
								<Image
									src={
										row.original.providerId.avatar.includes("https://")
											? row.original.providerId.avatar
											: `https://${row.original.providerId.avatar}`
									}
									alt="Your image"
									fill
								/>
							) : (
								<div className=" w-full h-full bg-slate-300 flex justify-center items-center text-xs">{`${row.original?.providerId?.firstName
									.charAt(0)
									.toUpperCase()} ${row.original.providerId.lastName
									.charAt(0)
									.toUpperCase()}`}</div>
							)}
						</div>
						<span className=" text-slate-600 text-xs">{`${row.original?.providerId?.firstName} ${row.original?.providerId?.lastName}`}</span>
					</div>
				),
				header: () => <span className="text-sm text-[#7C7C7C] ">Provider</span>,
			},
			{
				accessorKey: "customer",
				cell: ({ row }) => (
					<div key={row.id} className="flex gap-2 items-center ml-8">
						<div className=" relative overflow-hidden rounded-full w-[35px] h-[35px] flex justify-center items-center">
							{row.original?.customerId?.avatar ? (
								<Image
									src={
										row.original.customerId.avatar.includes("https://")
											? row.original.customerId.avatar
											: `https://${row.original.customerId.avatar}`
									}
									alt={"pro"}
									fill
								/>
							) : (
								<div className=" w-full h-full bg-slate-300 flex justify-center items-center text-xs">{`${row.original?.customerId?.firstName
									.charAt(0)
									.toUpperCase()} ${row.original.customerId.lastName
									.charAt(0)
									.toUpperCase()}`}</div>
							)}
						</div>
						<span className=" text-slate-500 text-xs">{`${row.original?.customerId?.firstName} ${row.original?.customerId?.lastName}`}</span>
					</div>
				),
				header: () => (
					<span className="text-sm text-[#7C7C7C] ml-8">Customer</span>
				),
			},
			{
				accessorKey: "service",
				cell: ({ row }) => (
					<div key={row.id} className="flex gap-4 items-center ml-8">
						<span className=" text-slate-600 text-xs">
							{row.original?.serviceId?.name}
						</span>
					</div>
				),
				header: () => (
					<span className="text-sm text-[#7C7C7C] ml-8">Service</span>
				),
			},
			{
				accessorKey: "status",
				cell: ({ cell }) => {
					switch (cell.getValue()) {
						case "pending":
							return (
								<span className="flex justify-between items-center w-fit">
									<span className="p-1 rounded-full bg-amber-500 mr-1" />
									<span className="text-amber-500 text-xs">Pending</span>
								</span>
							);
						case "in progress":
							return (
								<span className="flex justify-between items-center w-fit">
									<span className="p-1 rounded-full bg-lime-600 mr-1" />
									<span className="text-lime-600 text-xs">Processing</span>
								</span>
							);
						case "canceled":
							return (
								<span className="flex justify-between items-center w-fit">
									<span className="p-1 rounded-full bg-red-500 mr-1" />
									<span className="text-red-500 text-xs">Canceled</span>
								</span>
							);
						case "completed":
							return (
								<span className="flex justify-between items-center w-fit">
									<span className="p-1 rounded-full bg-blue-500 mr-1" />
									<span className="text-blue-500 text-xs">Completed</span>
								</span>
							);
					}
				},
				header: () => <span className="">Status</span>,
			},
			{
				accessorKey: "amount",
				cell: ({ row }) => (
					<span className="text-afruna-blue text-xs">
						#{row.original.amount}
					</span>
				),
				header: () => <span className="text-sm text-[#7C7C7C]">Amount</span>,
			},
			// {
			//   id: "actions",
			//   cell: ({ row }) => (
			//     <div className="flex justify-start gap-1 items-center">
			//       <button className="hover:scale-90 border-none transition duration-300">
			//         <MdRemoveRedEye size={24} />
			//       </button>
			//       <button
			//         className="hover:scale-90 border-none transition duration-300"
			//         onClick={() => {
			//           const newData = data.filter((_, idx) => idx !== row.index);
			//           setData(newData);
			//         }}
			//       >
			//         <MdDeleteOutline size={24} />
			//       </button>
			//     </div>
			//   ),
			//   header: () => <span className="text-sm text-[#7C7C7C]">Action</span>,
			// },
		],
		[]
	);

	const table = useReactTable({
		data,
		columns,
		state: {
			rowSelection,
			sorting,
		},
		enableRowSelection: true, //enable row selection for all rows
		// enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
		onSortingChange: setSorting,
		onRowSelectionChange: setRowSelection,
		getSortedRowModel: getSortedRowModel(),
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="h-[50vh] px-4 bg-white relative rounded-lg overflow-auto">
			{loadingRecentBookings ? (
				<div className="flex justify-center items-center h-full">
					<ImSpinner3 className="h-10 w-10 animate-spin text-slate-400" />
				</div>
			) : [].length > 0 ? (
				<table className=" w-screen lg:w-full px-4 relative">
					<thead className="sticky top-0 bg-white z-20">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th
										className="text-left font-medium text-afruna-gray text-sm"
										key={header.id}
									>
										{header.index >= 1 &&
										header.id !== "actions" &&
										header.id !== "block" ? (
											<span className="flex justify-between items-center w-fit">
												{flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
												<span className="flex flex-col ">
													<BiChevronUp
														onClick={header.column.getToggleSortingHandler()}
														size={24}
														className="relative top-2 text-slate-400"
													/>
													<BiChevronDown
														onClick={header.column.getToggleSortingHandler()}
														size={24}
														className="relative -top-2"
													/>
												</span>
											</span>
										) : (
											flexRender(
												header.column.columnDef.header,
												header.getContext()
											)
										)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody className="my-10">
						{table.getRowModel().rows.map((row) => {
							return (
								<tr
									className="px-2 odd:border-y-[1px] odd:border-slate-300"
									key={row.id}
								>
									{row.getVisibleCells().map((cell) => {
										return (
											<td
												className="py-4 font-semibold text-left text-xs"
												key={cell.id}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			) : (
				<h3 className="flex justify-center text-sm text-slate-500 h-full items-center">
					Currently, No Recent Bookings
				</h3>
			)}
		</div>
	);
};

export default memo(RecentBookingTable);
