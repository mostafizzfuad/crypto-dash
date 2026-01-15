import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router"; // ১. ইমপোর্ট

createRoot(document.getElementById("root")).render(
	<StrictMode>
		{/* ২. পুরো অ্যাপ র‍্যাপ করা */}
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>
);
