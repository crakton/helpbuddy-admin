import { FC } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface CustomerRetentionChartProps {
	data: { month: string; retention: number }[];
}

const CustomerRetentionChart: FC<CustomerRetentionChartProps> = ({ data }) => {
	return (
		<Card>
			<CardContent className="p-4">
				<h2 className="text-lg font-semibold mb-4">Customer Retention</h2>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart
						data={data}
						margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
					>
						<XAxis dataKey="month" />
						<YAxis />
						<Tooltip />
						<Line
							type="monotone"
							dataKey="retention"
							stroke="#10b981"
							strokeWidth={2}
						/>
					</LineChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};

export default CustomerRetentionChart;
