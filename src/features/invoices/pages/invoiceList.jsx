import { useState } from "react";
import StatusFilter from "../components/statusFilter";
import InvoiceItem from "../components/invoiceItem";
import noInvoiceImage from "../../../assets/images/noInvoiceImage.png";

export default function InvoiceList() {
	const [filters, setFilters] = useState({
		draft: false,
		pending: false,
		paid: false,
	});
	console.log(filters);

	//dummy data
	const invoices = [
		{
			id: "RT3082",
			date: "Due 15 Aug 2021",
			name: "Elon Musk",
			amount: "5,120.50",
			status: "paid",
		},

		{
			id: "RT3081",
			date: "Due 12 Aug 2021",
			name: "Ada Lovelace",
			amount: "2,300.00",
			status: "pending",
		},
		{
			id: "RT3080",
			date: "Due 10 Aug 2021",
			name: "Jensen Huang",
			amount: "1,800.90",
			status: "draft",
		},
		{
			id: "RT3082",
			date: "Due 15 Aug 2021",
			name: "Elon Musk",
			amount: "5,120.50",
			status: "paid",
		},

		{
			id: "RT3081",
			date: "Due 12 Aug 2021",
			name: "Ada Lovelace",
			amount: "2,300.00",
			status: "pending",
		},
		{
			id: "RT3080",
			date: "Due 10 Aug 2021",
			name: "Jensen Huang",
			amount: "1,800.90",
			status: "draft",
		},
		{
			id: "RT3082",
			date: "Due 15 Aug 2021",
			name: "Elon Musk",
			amount: "5,120.50",
			status: "paid",
		},

		{
			id: "RT3081",
			date: "Due 12 Aug 2021",
			name: "Ada Lovelace",
			amount: "2,300.00",
			status: "pending",
		},
		{
			id: "RT3080",
			date: "Due 10 Aug 2021",
			name: "Jensen Huang",
			amount: "1,800.90",
			status: "draft",
		},
		{
			id: "RT3080",
			date: "Due 10 Aug 2021",
			name: "Jensen Huang",
			amount: "1,800.90",
			status: "draft",
		},
	];

	const filteredInvoices = invoices.filter((invoice) => {
		const activeFilters = Object.keys(filters).filter((key) => filters[key]);

		if (activeFilters.length === 0) return true;

		return activeFilters.includes(invoice.status);
	});

	return (
		<div className=" h-screen  flex items-center flex-col gap-15">
			{/* invoices top bar */}
			<div
				className="mt-[77px] mx-auto w-full max-w-[730px] h-[55px] 
			 flex justify-between opacity-100"
			>
				{/* left section */}
				<div>
					<h2 className="font-league-spartan font-bold text-4xl dark:text-dark-black">
						Invoices
					</h2>
					<p className="font-league-spartan font-medium text-light-text-muted">
						There are {invoices.length} total invoices
					</p>
				</div>

				{/* right section */}
				<div className="flex gap-10 items-center">
					{/* filter */}
					<div className="flex items-center">
						<StatusFilter selected={filters} setSelected={setFilters} />
					</div>

					{/* button */}
					<button
						className="flex items-center gap-3 bg-purple-primary hover:bg-purple-light
					 text-white px-3 py-3 rounded-full shadow transition"
					>
						<span className="flex items-center justify-center w-6 h-6 bg-white rounded-full">
							<svg
								className="w-4 h-4 text-purple-primary"
								fill="none"
								stroke="currentColor"
								strokeWidth="3"
								viewBox="0 0 24 24"
							>
								<path d="M12 5v14M5 12h14" />
							</svg>
						</span>

						{/* Text */}
						<span className="text-sm font-medium">New Invoice</span>
					</button>
				</div>
			</div>

			{/* Invoices list */}
			<div className="w-full max-w-[900px] flex flex-col pr-2 gap-4 overflow-y-auto scrollbox">
				{invoices.length === 0 ? (
					<div className="flex flex-col items-center justify-center mt-24 gap-6">
						<img src={noInvoiceImage} alt="No Invoice Displayed" />

						{/* Text */}
						<div className="text-center">
							<h3 className="font-league-spartan font-bold text-2xl dark:text-dark-black mb-3">
								There is nothing here
							</h3>
							<p className="font-league-spartan text-light-text-muted text-sm leading-relaxed">
								Create an invoice by clicking the{" "}
								<span className="font-bold">New Invoice</span> button and get
								started.
							</p>
						</div>
					</div>
				) : (
					filteredInvoices.map((invoice, index) => (
						<InvoiceItem key={`${invoice.id}-${index}`} invoice={invoice} />
					))
				)}
			</div>
		</div>
	);
}
