import { useEffect, useState } from "react";
import { Routes, Route } from "react-router"; // ১. ইমপোর্ট রাউটার কম্পোনেন্ট
import HomePage from "./pages/home"; // ২. ইমপোর্ট হোম পেজ

const API_URL = import.meta.env.VITE_COINS_API_URL;

const App = () => {
	const [coins, setCoins] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [limit, setLimit] = useState(10);
	const [filter, setFilter] = useState("");
	const [sortBy, setSortBy] = useState("market_cap_desc");

	useEffect(() => {
		// ১. আলাদা একটি async ফাংশন তৈরি করা
		const fetchCoins = async () => {
			try {
				const res = await fetch(
					`${API_URL}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
				);

				// ২. এরর চেক করা
				if (!res.ok) {
					throw new Error("Failed to fetch data");
				}

				const data = await res.json();
				setCoins(data);
			} catch (err) {
				// ৩. এরর হ্যান্ডেল করা
				console.log(err.message);
				setError(err.message);
			} finally {
				// ৪. সবশেষে লোডিং বন্ধ করা
				setLoading(false);
			}
		};

		// ৫. ফাংশনটি কল করা
		fetchCoins();
	}, [limit]);

	return (
		// ৩. রাউট সেটআপ
		<Routes>
			<Route
				path="/"
				element={
					<HomePage
						coins={coins}
						filter={filter}
						setFilter={setFilter}
						limit={limit}
						setLimit={setLimit}
						sortBy={sortBy}
						setSortBy={setSortBy}
						loading={loading}
						error={error}
					/>
				}
			/>
		</Routes>
	);
};

export default App;
