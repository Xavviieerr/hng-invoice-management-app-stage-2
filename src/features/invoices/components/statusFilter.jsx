import { useEffect, useRef, useState } from "react";

export default function StatusFilter({ selected, setSelected }) {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);

	const toggle = (key) => {
		setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	// Close on outside click
	useEffect(() => {
		const handler = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	// Close on ESC
	useEffect(() => {
		const handler = (e) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, []);

	return (
		<div ref={ref} className="relative inline-block">
			<button
				onClick={() => setOpen((o) => !o)}
				aria-haspopup="true"
				aria-expanded={open}
				className="flex items-center gap-2 text-sm font-league-spartan font-bold text-dark-black dark:text-white"
			>
				<span className="hidden sm:inline">Filter by status</span>
				<span className="sm:hidden">Filter</span>
				<svg
					className={`w-4 h-4 transition-transform text-purple-primary duration-200 ${open ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					viewBox="0 0 24 24"
				>
					<path d="M6 9l6 6 6-6" />
				</svg>
			</button>

			{open && (
				<div className="absolute left-1/2 -translate-x-1/2 mt-3 w-48 bg-white dark:bg-dark-card rounded-xl shadow-lg p-4 z-50">
					<div className="flex flex-col gap-3 text-sm">
						{["draft", "pending", "paid"].map((status) => (
							<label
								key={status}
								className="flex items-center gap-3 text-dark-black dark:text-white font-league-spartan font-bold capitalize cursor-pointer"
							>
								<input
									type="checkbox"
									className="accent-purple-primary w-4 h-4 cursor-pointer"
									checked={selected[status]}
									onChange={() => toggle(status)}
								/>
								{status}
							</label>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
