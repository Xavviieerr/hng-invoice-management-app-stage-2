import { useState } from "react";
import Backdrop from "./BackdropComponent";

export default function NewInvoiceForm({ setShow, show }) {
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

	// DEFAULT STATE (empty but realistic)
	const [form, setForm] = useState({
		fromStreet: "19 Union Terrace",
		fromCity: "London",
		fromPostCode: "E1 3EZ",
		fromCountry: "United Kingdom",

		clientName: "Alex Grim",
		clientEmail: "alexgrim@mail.com",
		toStreet: "84 Church Way",
		toCity: "Bradford",
		toPostCode: "BD1 9PB",
		toCountry: "United Kingdom",

		invoiceDate: "2021-08-20",
		paymentTerms: "Net 30 Days",
		description: "Graphic Design",

		items: [
			{ name: "Banner Design", qty: 1, price: "156.00", total: "156.00" },
			{ name: "Email Design", qty: 2, price: "200.00", total: "400.00" },
		],
	});

	const handleFormChange = (field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleItemChange = (index, field, value) => {
		setForm((prev) => {
			const items = [...prev.items];
			items[index] = { ...items[index], [field]: value };

			if (field === "qty" || field === "price") {
				const qty = Number(items[index].qty);
				const price = Number(items[index].price);
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
			<Backdrop isOpen={show} onClose={() => setShow(false)} />

			<div className="fixed top-0 left-0 h-full pl-20 w-full max-w-[616px] bg-white dark:bg-dark-bg z-40 overflow-y-auto shadow-2xl rounded-r-2xl">
				<div className="px-10 py-12 flex flex-col gap-8">
					{/* TITLE */}
					<h2 className="text-2xl font-bold text-dark-black dark:text-white">
						New Invoice
					</h2>

					{/* BILL FROM */}
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

					{/* BILL TO */}
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
								type="email"
								className={inputClass}
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

					{/* DATE + TERMS */}
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
							<select
								className={inputClass}
								value={form.paymentTerms}
								onChange={(e) =>
									handleFormChange("paymentTerms", e.target.value)
								}
							>
								{["Net 1 Day", "Net 7 Days", "Net 14 Days", "Net 30 Days"].map(
									(t) => (
										<option key={t}>{t}</option>
									),
								)}
							</select>
						</Field>
					</div>

					{/* DESCRIPTION */}
					<Field label="Project Description">
						<input
							className={inputClass}
							value={form.description}
							onChange={(e) => handleFormChange("description", e.target.value)}
						/>
					</Field>

					{/* ITEMS */}
					<section className="flex flex-col gap-4">
						<p className="text-light-text-muted font-bold text-base">
							Item List
						</p>

						{form.items.map((item, i) => (
							<div key={i} className="grid grid-cols-5 gap-3">
								<input
									className={inputClass}
									value={item.name}
									onChange={(e) => handleItemChange(i, "name", e.target.value)}
								/>
								<input
									type="number"
									className={inputClass}
									value={item.qty}
									onChange={(e) => handleItemChange(i, "qty", e.target.value)}
								/>
								<input
									className={inputClass}
									value={item.price}
									onChange={(e) => handleItemChange(i, "price", e.target.value)}
								/>
								<span>{item.total}</span>
								<button onClick={() => removeItem(i)}>X</button>
							</div>
						))}

						<button onClick={addItem} className="w-full py-4 rounded-full">
							+ Add New Item
						</button>
					</section>

					{/* ACTIONS */}
					<div className="flex justify-between pt-4">
						<button onClick={() => setShow(false)}>Discard</button>

						<div className="flex gap-3">
							<button>Save as Draft</button>
							<button className="bg-purple-primary text-white px-4 py-2 rounded-full">
								Save & Send
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
