"use client";

import Barchart from "@/components/Barchart";
import Piechart from "@/components/PieChart";
import RecentBookingTable from "@/components/RecentBookingTable";
import StatsDashboard from "@/components/StatsDashboard";
import TopProviderTable from "@/components/TopProviderTable";
import TopServiceTable from "@/components/TopServiceTable";
import { buttonVariants } from "@/components/ui/button";
import Dashboard from "@/services/dashboard.service";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import LoadingTopTable from "../_components/LoadingTopTable";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import LoadingCards from "../_components/LoadingCards";
import LoadingChart from "../_components/LoadingChart";
import withAuth from "@/utils/withAuth";

interface pageProps {}

export type T_booking_data = {
	_id: string;
	name: string;
	value: number;
};
export type T_bar_data = {
	name: string;
	booking: number;
	Income: number;
	// amt: number;
};

const DashboardPage: FC<pageProps> = ({}) => {
	const [loading, SetLoading] = useState<boolean>(false);
	const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
	const [loadingStats, setLoadingStats] = useState<boolean>(false);
	const [loadingTopSevices, setLoadingTopSevices] = useState<boolean>(false);
	const [loadingTopProviders, setLoadingTopProviders] =
		useState<boolean>(false);
	const [loadingRecentBookings, setLoadingRecentBookings] =
		useState<boolean>(false);

	const bookingsSummary = useSelector(
		(state: RootState) => state.dashboard?.bookingsSummary
	);
	const stats = useSelector((state: RootState) => state.dashboard.statistics);
	const pendingStats =
		stats && stats.filter((stat) => stat.status === "pending")[0];
	const completedStats =
		stats && stats.filter((stat) => stat.status === "completed")[0];
	const inProgressStats =
		stats && stats.filter((stat) => stat.status === "in progress")[0];
	const canceledStats =
		stats && stats.filter((stat) => stat.status === "canceled")[0];
	const booking_statictics = [
		{
			_id: completedStats?._id,
			name: "Completed",
			value: completedStats?.percentage,
		},
		{
			_id: inProgressStats?._id,
			name: "Processing",
			value: inProgressStats?.percentage,
		},
		{
			_id: pendingStats?._id,
			name: "Pending",
			value: pendingStats?.percentage,
		},
		{
			_id: canceledStats?._id,
			name: "Canceled",
			value: canceledStats?.percentage,
		},
	];
	const cards = useSelector((state: RootState) => state.dashboard.cards);
	const topProviders = useSelector(
		(state: RootState) => state.provider.topProviders
	);
	const topServices = useSelector(
		(state: RootState) => state.service.topServices
	);
	const recentBookings = useSelector(
		(state: RootState) => state.booking.recentBookings
	);

	return (
		<section className="flex flex-col gap-6 pb-12 ">
			<div className="flex justify-start items-center pl-4 lg:pl-6 bg-white w-full h-16">
				<h1 className="text-lg lg:pl-0 lg:text-xl leading-3 text-afruna-blue font-bold">
					Dashboard
				</h1>
			</div>
			<div className="flex flex-wrap gap-4 justify-start items-center px-6">
				{loading ? (
					<LoadingCards />
				) : (
					cards &&
					[
						// {
						// 	title: "Income",
						// 	number: `#${cards.totalEarnings}`,
						// },
						{
							title: "Users",
							number: `${cards.totalUsers}`,
						},
						{
							title: "Providers",
							number: `${cards.totalProviders}`,
						},
						{
							title: "Services",
							number: `${cards.totalServices}`,
						},
					].map((item) => {
						return <StatsDashboard key={item.title} {...item} />;
					})
				)}
			</div>
			<div className="flex justify-between gap-6 items-center lg:px-6 max-w-[93%] w-full">
				<div className="max-w-[60%] w-full bg-white rounded-xl border shadow-sm border-slate-300">
					<header className="flex justify-between w-full px-4 py-6 items-center">
						<h1 className="font-semibold text-slate-700">Booking Summary</h1>
					</header>
					{loadingSummary ? (
						<LoadingChart />
					) : bookingsSummary && bookingsSummary.length ? null : ( // <Barchart bar_data={bar_data} />
						<div className="h-[300px] flex justify-center items-center bg-white shadow w-full">
							Currently, there is no bookings summary
						</div>
					)}
				</div>
				<div className="max-w-[40%] w-full bg-white rounded-xl border shadow-sm border-slate-300">
					<header className="flex justify-start w-full px-4 py-6 items-center">
						<h1 className="font-semibold text-slate-700">Booking Statistics</h1>
						{/* <Link
              className={buttonVariants({ variant: "afrunaBlue" })}
              href={"/category"}
            >
              View all
            </Link> */}
					</header>
					{/* <ResponsiveContainer> */}
					{/* </ResponsiveContainer> */}
					{/* <ResponsiveContainer width="100%" height="80%"> */}
					{loadingStats ? (
						<LoadingChart />
					) : booking_statictics && booking_statictics.length ? (
						<Piechart booking_statictics={booking_statictics} />
					) : (
						<div className="h-[300px] flex justify-center items-center bg-white shadow w-full">
							Currently, no bookings statistics info
						</div>
					)}
				</div>
			</div>
			<div className=" flex justify-between gap-6 items-center lg:px-6 max-w-[97%] w-full">
				<div className=" overflow-hidden w-full bg-white  max-w-[100%] rounded-xl border shadow-sm border-slate-300">
					<header className="flex justify-between items-center py-4 px-4 ">
						<h1 className="font-bold text-slate-700 text-lg">Top service</h1>
						<div className="flex justify-end items-center font-bold text-sm text-purple-700 gap-3">
							<Link href={"/services"}>
								More <FaArrowRight className="text-sm  inline-flex" />
							</Link>
						</div>
					</header>
					{loadingTopSevices ? (
						<LoadingTopTable />
					) : topServices && topServices.length > 0 ? (
						<>
							{/* top service */}
							<TopServiceTable topServices={topServices} />
						</>
					) : (
						<p className="text-xs text-center w-full flex justify-center items-center h-[50vh]">
							Currently, there is no top services
						</p>
					)}
				</div>
				<div className=" overflow-hidden w-full bg-white  max-w-[100%] rounded-xl border shadow-sm border-slate-300">
					<header className="flex justify-between items-center py-4 px-4 ">
						<h1 className="font-bold text-slate-700 text-lg">Top Providers</h1>
						<div className="flex justify-end items-center font-bold text-sm text-purple-700 gap-3">
							<Link href={"/providers"}>
								More <FaArrowRight className="text-sm  inline-flex" />
							</Link>
						</div>
					</header>
					{loadingTopProviders ? (
						<LoadingTopTable />
					) : topProviders && topProviders.length > 0 ? (
						<>
							{/* top providers */}
							<TopProviderTable topProviders={topProviders} />
						</>
					) : (
						<p className="text-xs text-center w-full flex justify-center items-center h-[50vh]">
							Currently, there is no top providers
						</p>
					)}
				</div>
			</div>
			{/* recent bookings */}
			<div className=" overflow-hidden w-full bg-white mx-6 lg:px-6 max-w-[93%] rounded-xl border shadow-sm border-slate-300">
				<header className="flex justify-between items-center py-4 px-4 ">
					<h1 className="font-bold text-slate-700 text-lg">Recent Bookings</h1>
					<div className="flex justify-end items-center font-bold text-sm text-purple-700 gap-3">
						<Link
							href={"/bookings"}
							className={buttonVariants({ variant: "lightgradientblue" })}
						>
							More <FaArrowRight className="text-sm inline-flex ml-2" />
						</Link>
					</div>
				</header>
				<RecentBookingTable
					loadingRecentBookings={loadingRecentBookings}
					recentBookings={recentBookings}
				/>
			</div>
		</section>
	);
};

// export default withAuth(DashboardPage);
export default DashboardPage;
