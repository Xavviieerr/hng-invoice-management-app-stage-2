import React from "react";
import { useTheme } from "../context/themeContext";
import LightDarkButton from "../shared/invoice/LightDarkButton";
import Logo from "../assets/images/logo.png";
import user from "../assets/images/user.png";

export default function AppLayout({ children }) {
	const { theme } = useTheme();

	return (
		<div className={`${theme}`}>
			<div className="body flex bg-light-bg dark:bg-dark-bg">
				{/* Navigation side bar */}
				<div className="w-25.75 bg-light-sidebar z-50 dark:bg-dark-sidebar flex flex-col justify-between text-light-text-muted rounded-tr-3xl rounded-br-3xl h-screen">
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
				<main className="flex flex-col items-center min-h-screen w-full">
					{React.Children.map(children, (child) => (
						<div className="w-full max-w-[730px] h-screen shrink-0">
							{child}
						</div>
					))}
				</main>
			</div>
		</div>
	);
}
