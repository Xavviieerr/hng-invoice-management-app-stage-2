import { useState } from "react";
import Backdrop from "./BackdropComponent";

export default function EditForm({ setShowEdit, showEdit }) {
	const inputClass =
		"w-full border border-light-text-secondary dark:border-dark-card bg-white dark:bg-dark-card text-dark-black dark:text-white text-sm font-bold rounded-md px-4 py-3 outline-none focus:border-purple-primary transition placeholder:font-normal placeholder:text-light-text-muted";

	const labelClass =
		"text-light-text-muted dark:text-light-text-main text-xs mb-1 block";

	function Field({ label, children }) {
		return (
			<div className="flex flex-col">
				<label className={labelClass}>{label}</label>
				{children}
			</div>
		);
	}

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

	const [form, setForm] = useState({
		fromStreet: details.fromAddress.street,
		fromCity: details.fromAddress.city,
		fromPostCode: details.fromAddress.postCode,
		fromCountry: details.fromAddress.country,
		clientName: details.billTo.name,
		clientEmail: details.sentTo,
		toStreet: details.billTo.street,
		toCity: details.billTo.city,
		toPostCode: details.billTo.postCode,
		toCountry: details.billTo.country,
		invoiceDate: "2021-08-21",
		paymentTerms: "Net 30 Days",
		description: details.description,
		items: details.items.map((i) => ({ ...i })),
	});

	const handleFormChange = (field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleItemChange = (index, field, value) => {
		setForm((prev) => {
			const items = [...prev.items];
			items[index] = { ...items[index], [field]: value };
			if (field === "qty" || field === "price") {
				const qty = field === "qty" ? Number(value) : Number(items[index].qty);
				const price =
					field === "price"
						? Number(value)
						: Number(String(items[index].price).replace(",", ""));
				items[index].total = (qty * price).toFixed(2);
			}
			return { ...prev, items };
		});
	};

	const addItem = () => {
		setForm((prev) => ({
			...prev,
			items: [
				...prev.items,
				{ name: "", qty: 1, price: "0.00", total: "0.00" },
			],
		}));
	};

	const removeItem = (index) => {
		setForm((prev) => ({
			...prev,
			items: prev.items.filter((_, i) => i !== index),
		}));
	};

	return (
		<div className="absolute h-96">
			{/* Backdrop */}
			<Backdrop isOpen={showEdit} onClose={() => setShowEdit(false)} />

			{/* Slide-in panel */}
			<div className="fixed top-0 left-0 h-full pl-20 w-full max-w-[616px] bg-white dark:bg-dark-bg z-40 overflow-y-auto shadow-2xl rounded-r-2xl">
				<div className="px-10 py-12 flex flex-col gap-8">
					{/* Title */}
					<h2 className="text-2xl font-bold text-dark-black dark:text-white">
						Edit <span className="text-light-text-muted">#</span>
						{invoice.id}
					</h2>

					{/* Bill From */}
					<section className="flex flex-col gap-4">
						<p className="text-purple-primary font-bold text-sm">Bill From</p>

						<Field label="Street Address">
							<input
								className={inputClass}
								value={form.fromStreet}
								onChange={(e) => handleFormChange("fromStreet", e.target.value)}
							/>
						</Field>

						<div className="grid grid-cols-3 gap-3">
							<Field label="City">
								<input
									className={inputClass}
									value={form.fromCity}
									onChange={(e) => handleFormChange("fromCity", e.target.value)}
								/>
							</Field>
							<Field label="Post Code">
								<input
									className={inputClass}
									value={form.fromPostCode}
									onChange={(e) =>
										handleFormChange("fromPostCode", e.target.value)
									}
								/>
							</Field>
							<Field label="Country">
								<input
									className={inputClass}
									value={form.fromCountry}
									onChange={(e) =>
										handleFormChange("fromCountry", e.target.value)
									}
								/>
							</Field>
						</div>
					</section>

					{/* Bill To */}
					<section className="flex flex-col gap-4">
						<p className="text-purple-primary font-bold text-sm">Bill To</p>

						<Field label="Client's Name">
							<input
								className={inputClass}
								value={form.clientName}
								onChange={(e) => handleFormChange("clientName", e.target.value)}
							/>
						</Field>

						<Field label="Client's Email">
							<input
								className={inputClass}
								type="email"
								value={form.clientEmail}
								onChange={(e) =>
									handleFormChange("clientEmail", e.target.value)
								}
							/>
						</Field>

						<Field label="Street Address">
							<input
								className={inputClass}
								value={form.toStreet}
								onChange={(e) => handleFormChange("toStreet", e.target.value)}
							/>
						</Field>

						<div className="grid grid-cols-3 gap-3">
							<Field label="City">
								<input
									className={inputClass}
									value={form.toCity}
									onChange={(e) => handleFormChange("toCity", e.target.value)}
								/>
							</Field>
							<Field label="Post Code">
								<input
									className={inputClass}
									value={form.toPostCode}
									onChange={(e) =>
										handleFormChange("toPostCode", e.target.value)
									}
								/>
							</Field>
							<Field label="Country">
								<input
									className={inputClass}
									value={form.toCountry}
									onChange={(e) =>
										handleFormChange("toCountry", e.target.value)
									}
								/>
							</Field>
						</div>
					</section>

					{/* Invoice Date / Payment Terms */}
					<div className="grid grid-cols-2 gap-4">
						<Field label="Invoice Date">
							<input
								type="date"
								className={inputClass}
								value={form.invoiceDate}
								onChange={(e) =>
									handleFormChange("invoiceDate", e.target.value)
								}
							/>
						</Field>

						<Field label="Payment Terms">
							<div className="relative">
								<select
									className={
										inputClass + " appearance-none pr-10 cursor-pointer"
									}
									value={form.paymentTerms}
									onChange={(e) =>
										handleFormChange("paymentTerms", e.target.value)
									}
								>
									{[
										"Net 1 Day",
										"Net 7 Days",
										"Net 14 Days",
										"Net 30 Days",
									].map((t) => (
										<option key={t}>{t}</option>
									))}
								</select>
								<svg
									className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
									width="11"
									height="7"
									viewBox="0 0 11 7"
									fill="none"
								>
									<path
										d="M1 1l4.5 4.5L10 1"
										stroke="#7C5DFA"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>
						</Field>
					</div>

					{/* Project Description */}
					<Field label="Project Description">
						<input
							className={inputClass}
							value={form.description}
							onChange={(e) => handleFormChange("description", e.target.value)}
						/>
					</Field>

					{/* Item List */}
					<section className="flex flex-col gap-4">
						<p className="text-light-text-muted font-bold text-base">
							Item List
						</p>

						{/* Header */}
						<div className="grid grid-cols-[1fr_56px_96px_72px_20px] gap-3 text-light-text-muted text-xs">
							<span>Item Name</span>
							<span>Qty.</span>
							<span>Price</span>
							<span>Total</span>
							<span />
						</div>

						{form.items.map((item, i) => (
							<div
								key={i}
								className="grid grid-cols-[1fr_56px_96px_72px_20px] gap-3 items-center"
							>
								<input
									className={inputClass}
									placeholder="Item name"
									value={item.name}
									onChange={(e) => handleItemChange(i, "name", e.target.value)}
								/>
								<input
									className={inputClass + " text-center px-2"}
									type="number"
									min="1"
									value={item.qty}
									onChange={(e) => handleItemChange(i, "qty", e.target.value)}
								/>
								<input
									className={inputClass}
									value={item.price}
									onChange={(e) => handleItemChange(i, "price", e.target.value)}
								/>
								<span className="text-light-text-muted font-bold text-sm">
									{item.total}
								</span>
								<button
									onClick={() => removeItem(i)}
									className="text-light-text-muted hover:text-red-primary transition flex items-center justify-center"
								>
									<svg width="13" height="16" viewBox="0 0 13 16" fill="none">
										<path
											d="M11.5 2.5H8.5l-.857-1.5H5.357L4.5 2.5H1.5m10 0v12a1 1 0 01-1 1h-8a1 1 0 01-1-1v-12m10 0H1.5"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
							</div>
						))}

						<button
							onClick={addItem}
							className="w-full py-4 rounded-full bg-light-bg dark:bg-dark-card text-light-text-muted font-bold text-sm hover:bg-light-text-secondary transition mt-2"
						>
							+ Add New Item
						</button>
					</section>

					{/* Actions */}
					<div className="flex justify-end gap-3 pt-2 pb-4 px-10 sticky bottom-0 bg-white w-full rounded-tr-md">
						<button
							onClick={() => setShowEdit(false)}
							className="px-6 py-3 rounded-full bg-light-bg dark:bg-dark-card text-light-text-muted font-bold text-sm hover:opacity-80 transition"
						>
							Cancel
						</button>
						<button
							onClick={() => setShowEdit(false)}
							className="px-6 py-3 rounded-full bg-purple-primary hover:bg-purple-light text-white font-bold text-sm transition"
						>
							Save Changes
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
