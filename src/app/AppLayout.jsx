import { useTheme } from "../context/themeContext";
import LightDarkButton from "../shared/invoice/LightDarkButton";
import Logo from "../assets/images/logo.png";
import user from "../assets/images/user.png";

export default function AppLayout({ children }) {
	const { theme } = useTheme();

	return (
		<div className={`${theme}`}>
			<div className="body flex">
				{/* Navigation side bar */}
				<div className="w-[103px] bg-[#373B53] flex flex-col justify-between text-light-text-muted ring rounded-tr-3xl rounded-br-3xl h-screen">
					{/* top section */}
					<div className="h-[103px] bg-purple-primary rounded-br-3xl rounded-tr-3xl">
						<div className="h-1/2"></div>
						<img
							src={Logo}
							alt="Logo"
							className="absolute top-8 justify-self-center"
						/>
						<div className="bg-purple-light w-full h-1/2 rounded-tl-3xl rounded-br-3xl"></div>
					</div>

					{/* bottom section */}
					<div className="flex  flex-col gap-7  align-items-center">
						<div className="flex flex-row justify-center">
							<LightDarkButton />
						</div>
						<div className="rounded-br-3xl justify-items-center py-7 border-t border-t-light-text-muted">
							<img src={user} alt="user Icon" />
						</div>
					</div>
				</div>

				{/* main content area */}
				<main>{children}</main>
			</div>
		</div>
	);
}
