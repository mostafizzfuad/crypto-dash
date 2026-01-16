import CoinCard from "../components/CoinCard";
import LimitSelector from "../components/LimitSelector";
import FilterInput from "../components/FilterInput";
import SortSelector from "../components/SortSelector";
import Spinner from "../components/Spinner";

const HomePage = ({
	coins,
	filter,
	setFilter,
	limit,
	setLimit,
	sortBy,
	setSortBy,
	loading,
	error,
}) => {
	// ফিল্টারিং এবং সর্টিং লজিক এখন কম্পোনেন্টের ভেতরে
	const filteredCoins = coins
		.filter(
			(coin) =>
				coin.name.toLowerCase().includes(filter.toLowerCase()) ||
				coin.symbol.toLowerCase().includes(filter.toLowerCase()),
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

			{/* {loading && <p className="text-center">Loading...</p>} */}
			{loading && <Spinner color="white" />}
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

export default HomePage;
