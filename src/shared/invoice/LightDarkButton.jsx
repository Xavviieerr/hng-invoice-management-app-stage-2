import { useTheme } from "../../context/themeContext";
import DarkModeIcon from "../../assets/images/darkModeButton.png";
import LightModeIcon from "../../assets/images/lightModeButton.png";

const LightDarkButton = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<button onClick={toggleTheme} className="w-[20px] h-[20px]">
			{theme === "dark" ? (
				<img src={LightModeIcon} alt="Light Mode Icon" />
			) : (
				<img src={DarkModeIcon} alt="Dark Mode Icon" />
			)}
		</button>
	);
};

export default LightDarkButton;
