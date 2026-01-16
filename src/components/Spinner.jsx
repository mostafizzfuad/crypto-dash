import { BarLoader } from "react-spinners";

const override = {
	display: "block",
	margin: "100px auto", // মাঝখানে আনার জন্য মার্জিন
};

const Spinner = ({ color = "#007bff" }) => {
	return (
		<div className="spinner-container">
			<BarLoader
				color={color} // ডাইনামিক কালার প্রপ
				cssOverride={override}
				width={200} // স্পিনারের প্রস্থ
				aria-label="Loading Spinner"
				data-testid="loader"
			/>
		</div>
	);
};

export default Spinner;
