import { useState } from "react";

export default function StatusFilter({ selected, setSelected }) {
	const [open, setOpen] = useState(false);

	const toggle = (key) => {
		setSelected((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	return (
		<div className="relative mt-3 inline-block">
			{/* Trigger */}
			<button
				onClick={() => setOpen(!open)}
				className="flex items-center gap-2 text-sm font-league-spartan font-bold text-dark-black"
			>
				Filter by status
				{/* Arrow */}
				<svg
					className={`w-4 h-4 transition-transform text-purple-primary font-league-spartan duration-200 ${
						open ? "rotate-180" : "rotate-0"
					}`}
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					viewBox="0 0 24 24"
				>
					<path d="M6 9l6 6 6-6" />
				</svg>
			</button>

			{open && (
				<div className="absolute  left-1/2 -translate-x-1/2 mt-3 w-48 bg-white rounded-xl shadow-lg p-4 z-50">
					<div className="flex flex-col gap-3 text-sm text-gray-700">
						<label
							className="flex items-center gap-3 text-dark-black 
                        font-league-spartan font-bold"
						>
							<input
								type="checkbox"
								className="bg-light-text-muted pb-0.5 accent-purple-primary 
                                hover:outline-none hover:border-2 hover:border-purple-primary "
								checked={selected.draft}
								onChange={() => toggle("draft")}
							/>
							Draft
						</label>

						<label
							className="flex items-center gap-3 text-dark-black 
                        font-league-spartan font-bold"
						>
							<input
								type="checkbox"
								checked={selected.pending}
								className="bg-light-text-muted pb-0.5 accent-purple-primary 
                                hover:outline-none hover:border-2 hover:border-purple-primary "
								onChange={() => toggle("pending")}
							/>
							Pending
						</label>

						<label
							className="flex items-center gap-3 text-dark-black 
                        font-league-spartan font-bold"
						>
							<input
								className="bg-light-text-muted pb-0.5 accent-purple-primary 
                                hover:outline-none hover:border-2 hover:border-purple-primary "
								type="checkbox"
								checked={selected.paid}
								onChange={() => toggle("paid")}
							/>
							Paid
						</label>
					</div>
				</div>
			)}
		</div>
	);
}
