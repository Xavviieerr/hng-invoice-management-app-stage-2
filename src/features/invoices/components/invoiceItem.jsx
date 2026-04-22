import { useNavigate } from "react-router-dom";

export default function InvoiceItem({ invoice }) {
	const navigate = useNavigate();

	const statusStyles = {
		draft: "bg-gray-light text-gray-700",
		pending: "bg-orange-light text-orange-600",
		paid: "bg-green-light text-green-600",
	};

	const statusIconStyles = {
		draft: "bg-gray-primary",
		pending: "bg-orange-primary",
		paid: "bg-green-primary",
	};

	return (
		<div
			className="
        grid
        grid-cols-2
        md:grid-cols-5
        items-center
        gap-y-2 md:gap-y-0
        gap-x-4
        p-4
        bg-white
        rounded-lg
        shadow-sm hover:shadow-md
        transition
      "
		>
			{/* ID */}
			<div className="text-sm font-league-spartan font-bold text-dark-black">
				<span className="font-league-spartan font-bold text-light-text-muted">
					#
				</span>
				{invoice.id}
			</div>

			{/* DATE */}
			<div className="text-xs font-league-spartan font-normal text-light-text-muted md:block col-span-1">
				{invoice.date}
			</div>

			{/* NAME */}
			<div className="text-sm md:text-left font-league-spartan font-normal text-light-text-muted">
				{invoice.name}
			</div>

			{/* AMOUNT */}
			<div className="font-league-spartan font-bold text-dark-black text-right md:text-left">
				<span>£ </span>
				{invoice.amount}
			</div>

			{/* STATUS + ARROW */}
			<div className="flex items-center justify-end gap-3 md:justify-end">
				<span
					className={`flex  items-center justify-center gap-1 font-league-spartan font-bold w-35 py-2 rounded-sm capitalize ${
						statusStyles[invoice.status]
					}`}
				>
					<span
						className={`h-2 w-2 rounded-full ${statusIconStyles[invoice.status]}`}
					></span>
					{invoice.status}
				</span>

				<button
					onClick={() => navigate(`/invoice/${invoice.id}`)}
					className="text-gray-400 hover:text-gray-600"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						viewBox="0 0 24 24"
					>
						<path d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>
		</div>
	);
}
