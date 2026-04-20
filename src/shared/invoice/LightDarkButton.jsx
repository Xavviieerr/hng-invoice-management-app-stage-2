import { useTheme } from "../../context/themeContext";

const LightDarkButton = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			onClick={toggleTheme}
			style={{
				padding: "8px 16px",
				cursor: "pointer",
				borderRadius: "20px",
				border: "1px solid #ccc",
				backgroundColor: theme === "dark" ? "#444" : "#eee",
				color: theme === "dark" ? "#fff" : "#000",
				transition: "all 0.3s ease",
			}}
		>
			{/* Dynamic icon or text based on state */}
			{theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
		</button>
	);
};

export default LightDarkButton;
