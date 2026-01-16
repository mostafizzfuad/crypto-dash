import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import CoinChart from "../components/CoinChart";

const CoinDetailsPage = () => {
	const { id } = useParams(); // URL থেকে id বের করা

	// স্টেট ডিক্লেয়ারেশন
	const [coin, setCoin] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// ডেটা ফেচিং
	useEffect(() => {
		const fetchCoin = async () => {
			try {
				const res = await fetch(
					`https://api.coingecko.com/api/v3/coins/${id}`,
				);
				if (!res.ok) throw new Error("Failed to fetch coin data");
				const data = await res.json();
				setCoin(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchCoin();
	}, [id]); // <--- id পরিবর্তন হলে আবার ফেচ হবে

	// if (loading) return <p>Loading...</p>; // এটি সরিয়ে ফেলো
	if (loading) return <Spinner />;

	if (error) return <p>Error: {error}</p>;

	// কোড ক্লিন রাখার জন্য market_data আলাদা ভেরিয়েবলে নেওয়া হলো
	const marketData = coin.market_data;

	return (
		<div className="coin-details-container">
			{/* ব্যাক বাটন */}
			<Link to="/" className="back-link">
				← Back to Home
			</Link>

			<h1 className="coin-details-title">
				{coin.name} ({coin.symbol.toUpperCase()})
			</h1>

			<img
				src={coin.image.large}
				alt={coin.name}
				className="coin-details-image"
			/>

			{/* ডেসক্রিপশন: শুধুমাত্র প্রথম বাক্যটি নেওয়া হচ্ছে */}
			<p className="coin-details-description">
				{coin.description.en.split(". ")[0] + "."}
			</p>

			{/* বিস্তারিত তথ্য */}
			<div className="coin-details-info">
				<h3>Rank: #{coin.market_cap_rank}</h3>
				<h3>
					Current Price: $
					{marketData.current_price.usd.toLocaleString()}
				</h3>
				<h4>
					Market Cap: ${marketData.market_cap.usd.toLocaleString()}
				</h4>
				<h4>24h High: ${marketData.high_24h.usd.toLocaleString()}</h4>
				<h4>24h Low: ${marketData.low_24h.usd.toLocaleString()}</h4>

				{/* প্রাইস চেঞ্জ এবং কালার ইন্ডিকেটর */}
				<h4>
					24h Price Change:
					<span
						className={
							marketData.price_change_percentage_24h >= 0
								? "text-green-500"
								: "text-red-500"
						}
					>
						${marketData.price_change_24h.toFixed(2)} (
						{marketData.price_change_percentage_24h.toFixed(2)}%)
					</span>
				</h4>

				<h4>
					Circulating Supply:{" "}
					{marketData.circulating_supply.toLocaleString()}
				</h4>

				{/* Optional Chaining (?.) ব্যবহার করা হয়েছে কারণ সব কয়েনের ম্যাক্স সাপ্লাই থাকে না */}
				<h4>
					Total Supply:{" "}
					{marketData.total_supply?.toLocaleString() || "N/A"}
				</h4>
				<h4>
					Max Supply:{" "}
					{marketData.max_supply?.toLocaleString() || "N/A"}
				</h4>

				{/* তারিখ ফরম্যাট করা হয়েছে */}
				<h4>
					All-Time High: ${marketData.ath.usd.toLocaleString()} on{" "}
					{new Date(marketData.ath_date.usd).toLocaleDateString()}
				</h4>
				<h4>
					All-Time Low: ${marketData.atl.usd.toLocaleString()} on{" "}
					{new Date(marketData.atl_date.usd).toLocaleDateString()}
				</h4>
				<h4>
					Last Updated: {new Date(coin.last_updated).toLocaleString()}
				</h4>
			</div>

			<div style={{ margin: "40px 0", height: "400px" }}>
				<CoinChart coinId={id} />
			</div>

			{/* এক্সটার্নাল লিংকস */}
			<div className="coin-details-links">
				{coin.links.homepage[0] && (
					<p>
						🌐{" "}
						<a
							href={coin.links.homepage[0]}
							target="_blank"
							rel="noopener noreferrer"
						>
							Website
						</a>
					</p>
				)}
				{coin.links.blockchain_site[0] && (
					<p>
						🧩{" "}
						<a
							href={coin.links.blockchain_site[0]}
							target="_blank"
							rel="noopener noreferrer"
						>
							Blockchain Explorer
						</a>
					</p>
				)}
				{coin.categories.length > 0 && (
					<p>Categories: {coin.categories.join(", ")}</p>
				)}
			</div>
		</div>
	);
};

export default CoinDetailsPage;
