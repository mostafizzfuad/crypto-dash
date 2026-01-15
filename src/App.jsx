import { useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import HomePage from "./pages/home";
import AboutPage from "./pages/about";
import Header from "./components/Header";
import NotFound from "./pages/not-found";
import CoinDetailsPage from "./pages/coin-details";

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
		<>
			<Header />
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
				<Route path="/about" element={<AboutPage />} />

				{/* ডাইনামিক রাউট যোগ করা */}
				<Route path="/coin/:id" element={<CoinDetailsPage />} />

				{/* Not Found Route - এটি সবসময় সবার শেষে রাখবে */}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</>
	);
};

export default App;
