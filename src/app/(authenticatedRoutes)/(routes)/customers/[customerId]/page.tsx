"use client";

import Customers from "@/services/customer.service";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LoadingUserDetails } from "../../_components/LoadingUserDetails";
import Image from "next/image";
import { useAppSelector } from "@/lib/store";

type Params = {
	params: {
		customerId: string;
	};
};

const CustomerDetailPage = ({ params: { customerId } }: Params) => {
	const { loading, customers } = useAppSelector((state) => state.customers);
	const [loadingBookings, setLoadingBookings] = useState<boolean>(true);
	useEffect(() => {}, [customerId]);
	const customerBookings = useAppSelector((state) => state.customers);

	const customer = customers.filter(
		(customer) => customer.$id === customerId
	)[0];

	const createdAtDate = new Date(customer?.$createdAt);
	const year = createdAtDate.getFullYear();
	const day = createdAtDate.getDate();
	const monthIndex = createdAtDate.getMonth(); // Months are zero-indexed
	const month = new Date(year, monthIndex).toLocaleString("en-US", {
		month: "short",
	});

	return (
		<section className="flex flex-col gap-7 ">
			<div className="flex justify-start items-center pl-4 lg:pl-6 bg-white w-full h-16">
				<h1 className="text-xl lg:pl-0  leading-3 text-afruna-blue font-bold">
					Customer Details
				</h1>
			</div>
			{loading ? (
				<LoadingUserDetails />
			) : (
				<>
					<div className="flex flex-col justify-start gap-2 px-4 md:px-10 xl:pr-32 w-full">
						<div className="w-[6rem] h-[6rem] overflow-hidden relative rounded-full">
							{customer?.avatar ? (
								<Image
									src={
										customer.avatar.includes("https://")
											? customer.avatar
											: `https://${customer.avatar}`
									}
									alt="provider"
									priority
									fill
								/>
							) : (
								<div className=" w-full h-full bg-slate-300 flex justify-center items-center text-sm">{`${
									customer.fullName.split(" ")[0][0]
								} ${customer.fullName.split(" ")[1][0]}`}</div>
							)}
						</div>
						<div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4 w-full">
							<div className="flex flex-col gap-2 text-[#7C7C7C] text-xs font-semibold">
								<h2 className="text-lg text-afruna-blue">
									{customer.fullName}
								</h2>
								<span className=" ">
									Joined since {`${day} ${month}, ${year}`}
								</span>
								{/* state,  */}
								<span className=" ">{customer?.country}</span>
								<span className=" ">{customer?.email}</span>
								{/* <div className="flex flex-col ">
									<span className="text-sm text-black">
										{customer?.prefs.following?.length}
									</span>
									<p className="">Following</p>
								</div> */}
							</div>
						</div>
					</div>
					<div className="flex justify-start px-4 md:px-10 xl:pr-32 ">
						<div className="flex justify-start items-start gap-2">
							<div className="border w-[13rem] py-7 pl-7 border-[#D5D5E6] rounded-xl bg-white flex flex-col gap-2">
								<span className="text-sm font-bold">0</span>
								<span className="text-sm font-bold">Total spent</span>
							</div>
							<div className="border w-[13rem] py-7 pl-7 border-[#D5D5E6] rounded-xl bg-white flex flex-col gap-2">
								<span className="text-sm font-bold">0</span>
								<span className="text-sm font-bold">Total booked</span>
							</div>
						</div>
					</div>
				</>
			)}
			<div className="flex justify-start px-4 md:px-10 xl:pr-32 "></div>
		</section>
	);
};

export default CustomerDetailPage;
