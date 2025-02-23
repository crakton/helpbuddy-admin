import { FC } from "react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface BookingDurationChartProps {
	data: { day: string; duration: number }[];
}

const BookingDurationChart: FC<BookingDurationChartProps> = ({ data }) => {
	return (
		<Card>
			<CardContent className="p-4">
				<h2 className="text-lg font-semibold mb-4">Booking Duration Trends</h2>
				<ResponsiveContainer width="100%" height={300}>
					<AreaChart
						data={data}
						margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
					>
						<XAxis dataKey="day" />
						<YAxis />
						<Tooltip />
						<Area
							type="monotone"
							dataKey="duration"
							stroke="#f59e0b"
							fill="#fcd34d"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};

export default BookingDurationChart;
