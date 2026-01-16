import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeScale, // TimeScale ইমপোর্ট করা জরুরি
	Filler,
} from "chart.js";
import "chartjs-adapter-date-fns"; // ডেট অ্যাডাপ্টার

// Chart.js কম্পোনেন্ট রেজিস্টার করা
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeScale,
	Filler,
);

const API_URL =
	import.meta.env.VITE_COIN_API_URL ||
	"https://api.coingecko.com/api/v3/coins";

const CoinChart = ({ coinId }) => {
	const [chartData, setChartData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchChartData = async () => {
			try {
				const res = await fetch(
					`${API_URL}/${coinId}/market_chart?vs_currency=usd&days=7`,
				);
				const data = await res.json();

				// ডেটা ফরম্যাট করা: x = সময়, y = দাম
				const prices = data.prices.map((price) => ({
					x: price[0], // Timestamp
					y: price[1], // Price
				}));

				setChartData({
					datasets: [
						{
							label: "Price (USD)",
							data: prices,
							fill: true, // গ্রাফের নিচের অংশ ভরাট হবে
							borderColor: "#007bff", // লাইনের কালার
							backgroundColor: "rgba(0, 123, 255, 0.1)", // ফিল কালার
							pointRadius: 0, // পয়েন্টারগুলো লুকানো থাকবে
							tension: 0.4, // লাইনটি স্মুথ বা কার্ভ হবে
						},
					],
				});
				setLoading(false);
			} catch (error) {
				console.error("Error fetching chart data:", error);
				setLoading(false);
			}
		};

		fetchChartData();
	}, [coinId]);

	// চার্টের অপশন কনফিগারেশন
	const options = {
		responsive: true,
		maintainAspectRatio: false, // এটি দিলে কন্টেইনারের হাইট নেবে
		plugins: {
			// legend: { posotion: "top" },
			legend: { display: false }, // লেজেন্ড হাইড করা হয়েছে ক্লিন লুকের জন্য
			title: {
				display: true,
				text: "Price History (Last 7 Days)",
			},
			tooltip: { mode: "index", intersect: false }, // হোভার করলে টুলটিপ আসবে
		},
		scales: {
			x: {
				type: "time", // X-অক্ষ হবে সময় ভিত্তিক
				time: {
					unit: "day", // দিন অনুযায়ী ভাগ হবে
				},
				grid: {
					display: false, // গ্রিড লাইন সরানো হয়েছে
				},
				ticks: {
					autoSkip: true,
					maxTicksLimit: 7, // সর্বোচ্চ ৭টি ডেট দেখাবে
				},
			},
			y: {
				beginAtZero: false, // ০ থেকে শুরু হবে না, কারণ বিটকয়েনের দাম অনেক বেশি
				ticks: {
					// ভ্যালুর আগে $ সাইন যুক্ত করা
					callback: (value) => `$${value.toLocaleString()}`,
				},
				grid: {
					color: "#f0f0f0", // হালকা গ্রিড লাইন
				},
			},
		},
	};

	// লোডিং স্টেট চেক
	if (loading) return <p className="text-center">Loading chart...</p>;

	return (
		<div style={{ marginTop: "30px", height: "400px", width: "100%" }}>
			{chartData && <Line options={options} data={chartData} />}
		</div>
	);
};

export default CoinChart;
