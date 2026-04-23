import React from "react";
import { useTheme } from "../context/themeContext";
import LightDarkButton from "../shared/invoice/LightDarkButton";
import Logo from "../assets/images/logo.png";
import user from "../assets/images/user.png";

export default function AppLayout({ children }) {
	const { theme } = useTheme();

	return (
		<div className={theme}>
			<div className="min-h-screen bg-light-bg dark:bg-dark-bg flex flex-col md:flex-row">
				{/* ── Mobile: top nav bar ── */}
				<header className="lg:hidden flex items-center justify-between bg-light-sidebar dark:bg-dark-sidebar w-full h-[72px] px-4 z-50">
					{/* Logo */}
					<div className="relative w-[72px] h-[72px] bg-purple-primary rounded-br-2xl rounded-tr-2xl flex items-center justify-center">
						<img
							src={Logo}
							alt="Logo"
							className="w-8 h-8 object-contain z-10"
						/>
						<div className="absolute bottom-0 left-0 right-0 h-1/2 bg-purple-light rounded-tl-2xl rounded-br-2xl" />
					</div>

					<div className="flex items-center gap-4">
						<LightDarkButton />
						<div className="border-l border-light-text-muted pl-4">
							<img src={user} alt="user" className="w-8 h-8 rounded-full" />
						</div>
					</div>
				</header>

				{/* ── Desktop: side nav bar ── */}
				<aside className="hidden lg:flex flex-col justify-between bg-light-sidebar dark:bg-dark-sidebar w-[103px] min-h-screen rounded-tr-3xl rounded-br-3xl z-50 shrink-0">
					{/* Logo block */}
					<div className="relative h-[103px] bg-purple-primary rounded-tr-3xl rounded-br-3xl overflow-hidden flex items-center justify-center">
						<img
							src={Logo}
							alt="Logo"
							className="w-10 h-10 object-contain z-10"
						/>
						<div className="absolute bottom-0 left-0 right-0 h-1/2 bg-purple-light rounded-tl-3xl rounded-br-3xl" />
					</div>

					{/* Bottom controls */}
					<div className="flex flex-col items-center gap-6 pb-6">
						<LightDarkButton />
						<div className="w-full border-t border-light-text-muted pt-6 flex justify-center">
							<img src={user} alt="user" className="w-9 h-9 rounded-full" />
						</div>
					</div>
				</aside>

				{/* ── Main content ── */}
				<main className="flex-1 overflow-y-auto">{children}</main>
			</div>
		</div>
	);
}
