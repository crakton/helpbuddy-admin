import { FC } from "react";
import { Bar } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface RevenueChartProps {
	data: { month: string; revenue: number }[];
}

const RevenueChart: FC<RevenueChartProps> = ({ data }) => {
	return (
		<Card>
			<CardContent className="p-4">
				<h2 className="text-lg font-semibold mb-4">Revenue Trends</h2>
				<Bar dataKey={"month"} width={500} height={300} data={data as any}>
					<Bar dataKey="revenue" fill="#3b82f6" />
				</Bar>
			</CardContent>
		</Card>
	);
};

export default RevenueChart;
