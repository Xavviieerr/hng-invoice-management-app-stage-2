import { useTheme } from "../context/themeContext";
import LightDarkButton from "../shared/invoice/LightDarkButton";

export default function AppLayout({ children }) {
	const { theme } = useTheme();

	return (
		<div className={`${theme}`}>
			<div className="body">
				{/* <LightDarkButton /> */}

				<div className="w-[103px] text-light-text-muted ring rounded-tr-2xl rounded-br-2xl h-screen">
					sidebar
				</div>
				{/* <main>{children}</main> */}
			</div>
		</div>
	);
}
