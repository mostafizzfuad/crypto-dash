import { useEffect, useState } from "react";
import CoinCard from "./components/CoinCard";

const API_URL =
	"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

const App = () => {
	const [coins, setCoins] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		// ১. আলাদা একটি async ফাংশন তৈরি করা
		const fetchCoins = async () => {
			try {
				const res = await fetch(API_URL);

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
	}, []);

	return (
		<div className="min-h-screen">
			<h1>🚀 Crypto Dash</h1>
			{loading && <p className="text-center">Loading...</p>}
			{error && <p className="text-center text-red-500">❌ {error}</p>}

			{/* মেইন ডেটা গ্রিড (যদি লোডিং না থাকে এবং এরর না থাকে) */}
			{!loading && !error && (
				<main className="grid">
					{coins.map((coin) => (
						<CoinCard key={coin.id} coin={coin} />
					))}
				</main>
			)}
		</div>
	);
};

export default App;
