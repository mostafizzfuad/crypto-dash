import { useEffect, useState } from "react";
import CoinCard from "./components/CoinCard";
import LimitSelector from "./components/LimitSelector";
import FilterInput from "./components/FilterInput";
import SortSelector from "./components/SortSelector";

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

	const filteredCoins = coins
		.filter(
			(coin) =>
				coin.name.toLowerCase().includes(filter.toLowerCase()) ||
				coin.symbol.toLowerCase().includes(filter.toLowerCase())
		)
		.slice() // 🔥 ১. অরিজিনাল অ্যারে কপি করা (Immutability)
		.sort((a, b) => {
			// ২. সর্টিং লজিক
			switch (sortBy) {
				case "market_cap_desc":
					return b.market_cap - a.market_cap; // বড় থেকে ছোট
				case "price_desc":
					return b.current_price - a.current_price;
				case "price_asc":
					return a.current_price - b.current_price; // ছোট থেকে বড়
				case "change_desc":
					return (
						b.price_change_percentage_24h -
						a.price_change_percentage_24h
					);
				case "change_asc":
					return (
						a.price_change_percentage_24h -
						b.price_change_percentage_24h
					);
				default:
					return 0;
			}
		});

	return (
		<div className="min-h-screen">
			<h1>🚀 Crypto Dash</h1>

			{/* কন্ট্রোল সেকশন: ফিল্টার এবং লিমিট সিলেক্টর পাশাপাশি থাকবে */}
			<div className="top-controls">
				<LimitSelector limit={limit} onLimitChange={setLimit} />
				<FilterInput filter={filter} onFilterChange={setFilter} />
				<SortSelector sortBy={sortBy} onSortChange={setSortBy} />
			</div>

			{loading && <p className="text-center">Loading...</p>}
			{error && <p className="text-center text-red-500">❌ {error}</p>}

			{/* মেইন ডেটা গ্রিড (যদি লোডিং না থাকে এবং এরর না থাকে) */}
			{!loading && !error && (
				<main className="grid">
					{/* যদি ফিল্টার করা কয়েন পাওয়া যায় তবে ম্যাপ করো, না হলে মেসেজ দেখাও */}
					{filteredCoins.length > 0 ? (
						filteredCoins.map((coin) => (
							<CoinCard key={coin.id} coin={coin} />
						))
					) : (
						<p style={{ textAlign: "center", gridColumn: "1/-1" }}>
							No coins match your filter.
						</p>
					)}
				</main>
			)}
		</div>
	);
};

export default App;
