import { useNavigate } from "react-router-dom";

export default function InvoiceItem({ invoice }) {
	const navigate = useNavigate();

	const statusStyles = {
		draft:
			"bg-gray-100 dark:bg-gray-primary/20 text-gray-primary dark:text-gray-400",
		pending: "bg-orange-light text-orange-primary",
		paid: "bg-green-light text-green-primary",
	};

	const dotStyles = {
		draft: "bg-gray-primary",
		pending: "bg-orange-primary",
		paid: "bg-green-primary",
	};

	return (
		<button
			onClick={() => navigate(`/invoice/${invoice.id}`)}
			className="w-full text-left grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr_1fr_auto_auto] items-center gap-x-4 gap-y-2 p-5 bg-white dark:bg-dark-sidebar rounded-lg shadow-sm hover:shadow-md hover:border hover:border-purple-primary border border-transparent transition cursor-pointer"
		>
			{/* ID */}
			<span className="text-sm font-bold font-league-spartan text-dark-black dark:text-white">
				<span className="text-light-text-muted">#</span>
				{invoice.id}
			</span>

			{/* DATE */}
			<span className="text-xs text-light-text-muted font-league-spartan md:col-span-1 col-start-1">
				{invoice.date}
			</span>

			{/* NAME */}
			<span className="text-sm text-light-text-muted font-league-spartan hidden md:block">
				{invoice.name}
			</span>
			{/* Mobile name */}
			<span className="text-xs text-light-text-muted font-league-spartan md:hidden col-start-1">
				{invoice.name}
			</span>

			{/* AMOUNT */}
			<span className="font-bold font-league-spartan text-dark-black dark:text-white text-right md:text-left">
				£ {invoice.amount}
			</span>

			{/* STATUS */}
			<span
				className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-bold font-league-spartan capitalize w-28 ${statusStyles[invoice.status]}`}
			>
				<span className={`w-2 h-2 rounded-full ${dotStyles[invoice.status]}`} />
				{invoice.status}
			</span>

			{/* ARROW */}
			<span className="hidden md:flex items-center justify-center text-purple-primary">
				<svg
					className="w-4 h-4"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					viewBox="0 0 24 24"
				>
					<path d="M9 5l7 7-7 7" />
				</svg>
			</span>
		</button>
	);
}
