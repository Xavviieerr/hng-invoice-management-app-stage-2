import { useState } from "react";
import { useInvoices } from "../../../context/InvoiceContext";
import StatusFilter from "../components/statusFilter";
import InvoiceItem from "../components/invoiceItem";
import NewInvoiceForm from "../components/NewInvoiceForm";
import noInvoiceImage from "../../../assets/images/noInvoiceImage.png";

export default function InvoiceList() {
	const { invoices, createInvoice, saveDraft } = useInvoices();
	const [showNew, setShowNew] = useState(false);
	const [filters, setFilters] = useState({
		draft: false,
		pending: false,
		paid: false,
	});

	const activeFilters = Object.keys(filters).filter((k) => filters[k]);
	const filtered = invoices.filter((inv) =>
		activeFilters.length === 0 ? true : activeFilters.includes(inv.status),
	);

	const handleCreate = (form) => {
		createInvoice(form, "pending");
		setShowNew(false);
	};

	const handleDraft = (form) => {
		saveDraft(form);
		setShowNew(false);
	};

	return (
		<div className="min-h-screen flex flex-col items-center gap-8 px-4 md:px-6 py-8 md:py-12 font-league-spartan">
			{/* New Invoice Form */}
			<NewInvoiceForm
				isOpen={showNew}
				onClose={() => setShowNew(false)}
				onSave={handleCreate}
				onDraft={handleDraft}
				title="New Invoice"
				submitLabel="Save & Send"
			/>

			{/* ── Top bar ── */}
			<div className="w-full max-w-[730px] flex items-center justify-between">
				{/* Left */}
				<div>
					<h1 className="font-bold text-3xl md:text-4xl text-dark-black dark:text-white">
						Invoices
					</h1>
					<p className="text-light-text-muted text-sm mt-1">
						<span className="hidden sm:inline">There are </span>
						{filtered.length}
						<span className="hidden sm:inline"> total invoices</span>
						<span className="sm:hidden"> invoices</span>
					</p>
				</div>

				{/* Right */}
				<div className="flex items-center gap-5 md:gap-10">
					<StatusFilter selected={filters} setSelected={setFilters} />

					<button
						onClick={() => setShowNew(true)}
						className="flex items-center gap-2 md:gap-3 bg-purple-primary hover:bg-purple-light text-white px-3 py-3 md:px-4 rounded-full shadow transition"
					>
						<span className="flex items-center justify-center w-7 h-7 bg-white rounded-full shrink-0">
							<svg
								className="w-3 h-3 text-purple-primary"
								fill="none"
								stroke="currentColor"
								strokeWidth="3"
								viewBox="0 0 24 24"
							>
								<path d="M12 5v14M5 12h14" />
							</svg>
						</span>
						<span className="text-sm font-bold pr-1 hidden sm:inline">
							New Invoice
						</span>
						<span className="text-sm font-bold pr-1 sm:hidden">New</span>
					</button>
				</div>
			</div>

			{/* ── Invoice list ── */}
			<div className="w-full max-w-[730px] flex flex-col gap-4 pb-8">
				{invoices.length === 0 ? (
					/* Empty state - no invoices at all */
					<div className="flex flex-col items-center justify-center mt-16 gap-8">
						<img
							src={noInvoiceImage}
							alt="No invoices"
							className="w-48 h-48 object-contain"
						/>
						<div className="text-center">
							<h3 className="font-bold text-2xl text-dark-black dark:text-white mb-3">
								There is nothing here
							</h3>
							<p className="text-light-text-muted text-sm leading-relaxed max-w-[200px] mx-auto">
								Create an invoice by clicking the{" "}
								<span className="font-bold">New Invoice</span> button and get
								started.
							</p>
						</div>
					</div>
				) : filtered.length === 0 ? (
					/* Empty state - no results for filter */
					<div className="flex flex-col items-center justify-center mt-16 gap-6">
						<div className="text-center">
							<h3 className="font-bold text-xl text-dark-black dark:text-white mb-2">
								No results
							</h3>
							<p className="text-light-text-muted text-sm">
								No invoices match the selected filter.
							</p>
						</div>
					</div>
				) : (
					filtered.map((invoice, index) => (
						<InvoiceItem key={`${invoice.id}-${index}`} invoice={invoice} />
					))
				)}
			</div>
		</div>
	);
}
