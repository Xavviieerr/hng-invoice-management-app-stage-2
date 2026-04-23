import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInvoices } from "../../../context/InvoiceContext";
import InvoiceForm from "../components/NewInvoiceForm";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function InvoiceDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { getInvoice, updateInvoice, deleteInvoice, markAsPaid } =
		useInvoices();

	const [showEdit, setShowEdit] = useState(false);
	const [showDelete, setShowDelete] = useState(false);

	const invoice = getInvoice(id);

	if (!invoice) {
		return (
			<div className="min-h-screen flex items-center justify-center font-league-spartan">
				<div className="text-center">
					<p className="text-light-text-muted text-lg mb-4">
						Invoice not found.
					</p>
					<button
						onClick={() => navigate("/")}
						className="px-6 py-3 rounded-full bg-purple-primary text-white font-bold text-sm hover:bg-purple-light transition"
					>
						Go back
					</button>
				</div>
			</div>
		);
	}

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
	const s = statusStyles[invoice.status] || statusStyles.draft;

	const editInitial = {
		fromStreet: invoice.fromAddress?.street || "",
		fromCity: invoice.fromAddress?.city || "",
		fromPostCode: invoice.fromAddress?.postCode || "",
		fromCountry: invoice.fromAddress?.country || "",
		clientName: invoice.billTo?.name || invoice.name || "",
		clientEmail: invoice.sentTo || "",
		toStreet: invoice.billTo?.street || "",
		toCity: invoice.billTo?.city || "",
		toPostCode: invoice.billTo?.postCode || "",
		toCountry: invoice.billTo?.country || "",
		invoiceDate: invoice.invoiceDate || "",
		paymentTerms: invoice.paymentTerms || "Net 30 Days",
		description: invoice.description || "",
		items: (invoice.items || []).map((i) => ({ ...i })),
	};

	const handleSaveEdit = (form) => {
		updateInvoice(id, {
			...form,
			name: form.clientName,
			sentTo: form.clientEmail,
			fromAddress: {
				street: form.fromStreet,
				city: form.fromCity,
				postCode: form.fromPostCode,
				country: form.fromCountry,
			},
			billTo: {
				name: form.clientName,
				street: form.toStreet,
				city: form.toCity,
				postCode: form.toPostCode,
				country: form.toCountry,
			},
		});
		setShowEdit(false);
	};

	const handleDelete = () => {
		deleteInvoice(id);
		navigate("/");
	};

	const handleMarkPaid = () => {
		markAsPaid(id);
	};

	return (
		<div className="min-h-screen bg-light-bg dark:bg-dark-bg font-league-spartan">
			{/* Edit form overlay */}
			<InvoiceForm
				isOpen={showEdit}
				onClose={() => setShowEdit(false)}
				onSave={handleSaveEdit}
				title={`Edit #${invoice.id}`}
				initialForm={editInitial}
				submitLabel="Save Changes"
			/>

			{/* Delete confirm modal */}
			<DeleteConfirmModal
				isOpen={showDelete}
				onClose={() => setShowDelete(false)}
				onConfirm={handleDelete}
				invoiceId={invoice.id}
			/>

			<div className="px-4 md:px-6 py-6 md:py-8 max-w-[730px] mx-auto flex flex-col gap-6">
				{/* ── Go back ── */}
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

				{/* ── Status bar ── */}
				<div className="bg-white dark:bg-dark-sidebar rounded-lg px-6 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
					<div className="flex items-center gap-4 text-light-text-muted text-sm">
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

					{/* Desktop action buttons */}
					<div className="hidden sm:flex gap-3">
						<button
							onClick={() => setShowEdit(true)}
							className="px-6 py-3 rounded-full bg-light-bg dark:bg-dark-card text-light-text-main dark:text-white text-sm font-bold hover:opacity-80 transition"
						>
							Edit
						</button>
						<button
							onClick={() => setShowDelete(true)}
							className="px-6 py-3 rounded-full bg-red-primary text-white text-sm font-bold hover:bg-red-light transition"
						>
							Delete
						</button>
						{invoice.status !== "paid" && (
							<button
								onClick={handleMarkPaid}
								className="px-6 py-3 rounded-full bg-purple-primary text-white text-sm font-bold hover:bg-purple-light transition"
							>
								Mark as Paid
							</button>
						)}
					</div>
				</div>

				{/* ── Invoice body ── */}
				<div className="bg-white dark:bg-dark-sidebar rounded-lg px-6 md:px-8 py-6 shadow-sm flex flex-col gap-6 md:gap-8">
					{/* ID + from address */}
					<div className="flex flex-col sm:flex-row sm:justify-between gap-4">
						<div>
							<p className="font-bold text-dark-black dark:text-white text-base">
								<span className="text-light-text-muted">#</span>
								{invoice.id}
							</p>
							<p className="text-light-text-muted text-sm mt-1">
								{invoice.description}
							</p>
						</div>
						<div className="text-left sm:text-right text-light-text-muted text-sm leading-6">
							<p>{invoice.fromAddress?.street}</p>
							<p>{invoice.fromAddress?.city}</p>
							<p>{invoice.fromAddress?.postCode}</p>
							<p>{invoice.fromAddress?.country}</p>
						</div>
					</div>

					{/* Date / Bill To / Sent To */}
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8">
						<div className="flex flex-col gap-6">
							<div>
								<p className="text-light-text-muted text-xs mb-2">
									Invoice Date
								</p>
								<p className="font-bold text-dark-black dark:text-white text-sm">
									{invoice.invoiceDate}
								</p>
							</div>
							<div>
								<p className="text-light-text-muted text-xs mb-2">
									Payment Due
								</p>
								<p className="font-bold text-dark-black dark:text-white text-sm">
									{invoice.paymentDue}
								</p>
							</div>
						</div>

						<div>
							<p className="text-light-text-muted text-xs mb-2">Bill To</p>
							<p className="font-bold text-dark-black dark:text-white text-sm mb-2">
								{invoice.billTo?.name}
							</p>
							<div className="text-light-text-muted text-sm leading-6">
								<p>{invoice.billTo?.street}</p>
								<p>{invoice.billTo?.city}</p>
								<p>{invoice.billTo?.postCode}</p>
								<p>{invoice.billTo?.country}</p>
							</div>
						</div>

						<div className="col-span-2 sm:col-span-1">
							<p className="text-light-text-muted text-xs mb-2">Sent to</p>
							<p className="font-bold text-dark-black dark:text-white text-sm break-all">
								{invoice.sentTo}
							</p>
						</div>
					</div>

					{/* Items table */}
					<div className="bg-light-bg dark:bg-dark-card rounded-lg overflow-hidden">
						{/* Desktop header */}
						<div className="hidden sm:grid grid-cols-4 px-6 md:px-8 py-4 text-light-text-muted text-xs font-league-spartan">
							<span className="col-span-2">Item Name</span>
							<span className="text-center">QTY.</span>
							<span className="text-right">Price / Total</span>
						</div>

						<div className="flex flex-col gap-3 px-6 md:px-8 py-4">
							{(invoice.items || []).map((item, i) => (
								<div
									key={i}
									className="grid grid-cols-2 sm:grid-cols-4 items-center gap-2"
								>
									<div className="sm:col-span-2">
										<p className="font-bold text-dark-black dark:text-white text-sm">
											{item.name}
										</p>
										{/* Mobile qty x price */}
										<p className="text-light-text-muted text-sm sm:hidden">
											{item.qty} × £ {item.price}
										</p>
									</div>
									<span className="hidden sm:block text-center text-light-text-muted font-bold text-sm">
										{item.qty}
									</span>
									<div className="text-right">
										<p className="font-bold text-dark-black dark:text-white text-sm">
											£ {item.total}
										</p>
										<p className="hidden sm:block text-light-text-muted text-xs">
											£ {item.price}
										</p>
									</div>
								</div>
							))}
						</div>

						{/* Amount Due */}
						<div className="bg-gray-primary dark:bg-dark-black rounded-b-lg px-6 md:px-8 py-5 flex items-center justify-between">
							<span className="text-white text-sm">Amount Due</span>
							<span className="text-white font-bold text-xl md:text-2xl">
								£ {invoice.amount}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* ── Mobile bottom action bar ── */}
			<div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-sidebar px-6 py-4 flex justify-end gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
				<button
					onClick={() => setShowEdit(true)}
					className="px-5 py-3 rounded-full bg-light-bg dark:bg-dark-card text-light-text-main font-bold text-sm hover:opacity-80 transition"
				>
					Edit
				</button>
				<button
					onClick={() => setShowDelete(true)}
					className="px-5 py-3 rounded-full bg-red-primary text-white font-bold text-sm hover:bg-red-light transition"
				>
					Delete
				</button>
				{invoice.status !== "paid" && (
					<button
						onClick={handleMarkPaid}
						className="px-5 py-3 rounded-full bg-purple-primary text-white font-bold text-sm hover:bg-purple-light transition"
					>
						Mark as Paid
					</button>
				)}
			</div>
		</div>
	);
}
