import { Link } from "react-router";

const NotFound = () => {
	return (
		<div style={styles.container}>
			<h1 style={styles.title}>404</h1>
			<p style={styles.message}>
				Oops! The page you're looking for doesn't exist.
			</p>
			<Link to="/" style={styles.link}>
				← Go back to Home
			</Link>
		</div>
	);
};

// সাধারণ ইনলাইন স্টাইল (দ্রুত ডিজাইনের জন্য)
const styles = {
	container: {
		textAlign: "center",
		padding: "80px 20px",
		color: "#fff",
	},
	title: {
		fontSize: "72px",
		marginBottom: "20px",
	},
	message: {
		fontSize: "18px",
		marginBottom: "30px",
	},
	link: {
		textDecoration: "none",
		color: "#007bff",
		fontWeight: "bold",
	},
};

export default NotFound;
