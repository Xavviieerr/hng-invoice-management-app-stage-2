import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditForm from "../components/editForm";

export default function InvoiceDetail() {
	const navigate = useNavigate();
	const [showEdit, setShowEdit] = useState(false);

	const invoice = {
		id: "RT3082",
		date: "Due 15 Aug 2021",
		name: "Elon Musk",
		amount: "5,120.50",
		status: "paid",
	};

	const details = {
		invoiceDate: "15 Aug 2021",
		paymentDue: "15 Sep 2021",
		description: "Graphic Design",
		fromAddress: {
			street: "19 Union Terrace",
			city: "London",
			postCode: "E1 3EZ",
			country: "United Kingdom",
		},
		billTo: {
			name: "Elon Musk",
			street: "84 Church Way",
			city: "Bradford",
			postCode: "BD1 9PB",
			country: "United Kingdom",
		},
		sentTo: "elon@spacex.com",
		items: [
			{ name: "Banner Design", qty: 1, price: "156.00", total: "156.00" },
			{ name: "Email Design", qty: 2, price: "200.00", total: "400.00" },
			{ name: "Logo Design", qty: 1, price: "4,564.50", total: "4,564.50" },
		],
		amountDue: invoice.amount,
	};

	const statusStyles = {
		paid: {
			bg: "bg-green-light",
			dot: "bg-green-primary",
			text: "text-green-primary",
		},
		pending: {
			bg: "bg-orange-light",
			dot: "bg-orange-primary",
			text: "text-orange-primary",
		},
		draft: {
			bg: "bg-light-text-secondary",
			dot: "bg-light-sidebar",
			text: "text-light-sidebar",
		},
	};

	const s = statusStyles[invoice.status];

	return (
		<div className="relative min-h-screen bg-light-bg dark:bg-dark-bg font-league-spartan">
			{/* ── Main detail page ── */}
			<div className="px-6 py-5">
				{/* ── Edit overlay ── */}
				{showEdit && <EditForm setShowEdit={setShowEdit} showEdit={showEdit} />}

				<div className="max-w-[730px] mx-auto flex flex-col gap-6">
					{/* Go back */}
					<button
						onClick={() => navigate("/")}
						className="flex items-center gap-3 text-dark-black dark:text-white font-bold text-sm w-fit hover:opacity-60 transition"
					>
						<svg width="7" height="10" viewBox="0 0 7 10" fill="none">
							<path
								d="M6 1L2 5l4 4"
								stroke="#7C5DFA"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						Go back
					</button>

					{/* Status bar */}
					<div className="bg-white dark:bg-dark-sidebar rounded-lg px-8 py-4 flex items-center justify-between shadow-sm">
						<div className="flex items-center gap-5 text-light-text-muted text-sm">
							<span>Status</span>
							<div
								className={`flex items-center gap-2 px-4 py-2 rounded-md ${s.bg}`}
							>
								<span className={`w-2 h-2 rounded-full ${s.dot}`} />
								<span className={`font-bold capitalize ${s.text}`}>
									{invoice.status}
								</span>
							</div>
						</div>

						<div className="flex gap-3">
							<button
								onClick={() => setShowEdit(true)}
								className="px-6 py-3 rounded-full bg-light-bg dark:bg-dark-card text-light-text-main dark:text-white text-sm font-bold hover:opacity-80 transition"
							>
								Edit
							</button>
							<button className="px-6 py-3 rounded-full bg-red-primary text-white text-sm font-bold hover:bg-red-light transition">
								Delete
							</button>
							<button className="px-6 py-3 rounded-full bg-purple-primary text-white text-sm font-bold hover:bg-purple-light transition">
								Mark as Paid
							</button>
						</div>
					</div>

					{/* Invoice body */}
					<div className="bg-white dark:bg-dark-sidebar rounded-lg px-8 py-5 shadow-sm flex flex-col gap-5">
						<div className="flex justify-between">
							<div>
								<p className="font-bold text-dark-black dark:text-white text-base">
									<span className="text-light-text-muted">#</span>
									{invoice.id}
								</p>
								<p className="text-light-text-muted text-sm mt-1">
									{details.description}
								</p>
							</div>
							<div className="text-right text-light-text-muted text-sm leading-6">
								<p>{details.fromAddress.street}</p>
								<p>{details.fromAddress.city}</p>
								<p>{details.fromAddress.postCode}</p>
								<p>{details.fromAddress.country}</p>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-8">
							<div className="flex flex-col gap-8">
								<div>
									<p className="text-light-text-muted text-sm mb-2">
										Invoice Date
									</p>
									<p className="font-bold text-dark-black dark:text-white text-base">
										{details.invoiceDate}
									</p>
								</div>
								<div>
									<p className="text-light-text-muted text-sm mb-2">
										Payment Due
									</p>
									<p className="font-bold text-dark-black dark:text-white text-base">
										{details.paymentDue}
									</p>
								</div>
							</div>

							<div>
								<p className="text-light-text-muted text-sm mb-2">Bill To</p>
								<p className="font-bold text-dark-black dark:text-white text-base mb-2">
									{details.billTo.name}
								</p>
								<div className="text-light-text-muted text-sm leading-6">
									<p>{details.billTo.street}</p>
									<p>{details.billTo.city}</p>
									<p>{details.billTo.postCode}</p>
									<p>{details.billTo.country}</p>
								</div>
							</div>

							<div>
								<p className="text-light-text-muted text-sm mb-2">Sent to</p>
								<p className="font-bold text-dark-black dark:text-white text-base break-all">
									{details.sentTo}
								</p>
							</div>
						</div>

						<div className="bg-light-bg dark:bg-dark-card rounded-lg overflow-hidden">
							<div className="grid grid-cols-4 px-8 py-4 text-light-text-muted text-sm">
								<span className="col-span-2">Item Name</span>
								<span className="text-center">QTY.</span>
								<span className="text-right">Price</span>
							</div>

							<div className="flex flex-col gap-2 px-8 pb-4">
								{details.items.map((item, i) => (
									<div key={i} className="grid grid-cols-4 items-center py-1">
										<span className="col-span-2 font-bold text-dark-black dark:text-white text-sm">
											{item.name}
										</span>
										<span className="text-center text-light-text-muted font-bold text-sm">
											{item.qty}
										</span>
										<div className="flex justify-between">
											<span className="text-light-text-muted font-bold text-sm">
												£ {item.price}
											</span>
											<span className="font-bold text-dark-black dark:text-white text-sm">
												£ {item.total}
											</span>
										</div>
									</div>
								))}
							</div>

							<div className="bg-gray-primary dark:bg-dark-black rounded-b-lg px-8 py-6 flex items-center justify-between">
								<span className="text-white text-sm">Amount Due</span>
								<span className="text-white font-bold text-2xl">
									£ {details.amountDue}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
