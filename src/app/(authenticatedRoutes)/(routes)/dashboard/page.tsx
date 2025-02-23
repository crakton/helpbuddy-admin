"use client";

import { FC, useEffect, useState } from "react";
import Barchart from "@/components/Barchart";
import StatsDashboard from "@/components/StatsDashboard";
import TopProviderTable from "@/components/TopProviderTable";
import TopServiceTable from "@/components/TopServiceTable";
import withAuth from "@/lib/withAuth";
import { getDashboardStatistics } from "@/services/dashboard.service";
import RevenueChart from "@/components/RevenueChart";
import CustomerRetentionChart from "@/components/CustomerRetentionChart";
import BookingDurationChart from "@/components/BookingDurationChart";

const DashboardPage: FC = () => {
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState<any>(null);

	useEffect(() => {
		(async () => {
			try {
				const data = await getDashboardStatistics();
				setStats(data);
			} catch (error) {
				console.error("Error fetching dashboard stats:", error);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<section className="flex flex-col gap-6 pb-12">
			<div className="flex justify-start items-center pl-4 lg:pl-6 bg-white w-full h-16">
				<h1 className="text-lg lg:text-xl text-afruna-blue font-bold">
					Dashboard
				</h1>
			</div>
			<div className="flex flex-wrap gap-4 px-6">
				{loading ? (
					<p>Loading statistics...</p>
				) : (
					stats && (
						<>
							<StatsDashboard
								title="Total Customers"
								number={stats.totalUsers ?? 0}
							/>
							<StatsDashboard
								title="Active Customers"
								number={stats.activeUsers ?? 0}
							/>
							<StatsDashboard
								title="Total Services"
								number={stats.totalServices}
							/>
							<StatsDashboard
								title="Total Bookings"
								number={stats.totalBookings}
							/>
							<StatsDashboard
								title="Completed Bookings"
								number={stats.completedBookings}
							/>
							<StatsDashboard
								title="Total Revenue"
								number={`$${stats.totalRevenue}`}
							/>
						</>
					)
				)}
			</div>
			<div className="flex gap-6 px-6">
				<div className="w-2/3 bg-white p-4 rounded-xl shadow">
					<h2 className="font-semibold text-slate-700">Booking Summary</h2>
					<Barchart bar_data={stats?.bookingSummary as any} />
				</div>
				<div className="w-1/3 bg-white p-4 rounded-xl shadow">
					<h2 className="font-semibold text-slate-700">Revenue Trends</h2>
					<RevenueChart data={stats?.revenueTrends} />
				</div>
			</div>
			<div className="flex gap-6 px-6">
				<div className="w-1/2 bg-white p-4 rounded-xl shadow">
					<h2 className="font-semibold text-slate-700">Customer Retention</h2>
					<CustomerRetentionChart data={stats?.customerRetention} />
				</div>
				<div className="w-1/2 bg-white p-4 rounded-xl shadow">
					<h2 className="font-semibold text-slate-700">Booking Duration</h2>
					<BookingDurationChart data={stats?.bookingDuration} />
				</div>
			</div>
			{/* <div className="flex gap-6 px-6">
        <TopServiceTable data={stats?.topServices} />
        <TopProviderTable data={stats?.topProviders} />
      </div> */}
		</section>
	);
};

export default withAuth(DashboardPage);
