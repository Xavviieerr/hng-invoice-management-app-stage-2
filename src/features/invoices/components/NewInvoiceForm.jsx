import { useEffect, useRef, useState } from "react";
import Backdrop from "./BackdropComponent";
import { validateForm, hasErrors } from "../utils/validation";

const inputBase =
	"w-full border bg-white dark:bg-dark-card text-dark-black dark:text-white text-sm font-bold rounded-md px-4 py-3 outline-none transition font-league-spartan placeholder:font-normal placeholder:text-light-text-muted";
const inputNormal = `${inputBase} border-light-text-secondary dark:border-dark-card focus:border-purple-primary`;
const inputError = `${inputBase} border-red-primary focus:border-red-primary`;

function Field({ label, error, children }) {
	return (
		<div className="flex flex-col gap-1">
			<div className="flex justify-between">
				<label className="text-light-text-muted dark:text-light-text-main text-xs font-league-spartan">
					{label}
				</label>
				{error && (
					<span className="text-red-primary text-xs font-league-spartan">
						{error}
					</span>
				)}
			</div>
			{children}
		</div>
	);
}

const defaultForm = {
	fromStreet: "",
	fromCity: "",
	fromPostCode: "",
	fromCountry: "",
	clientName: "",
	clientEmail: "",
	toStreet: "",
	toCity: "",
	toPostCode: "",
	toCountry: "",
	invoiceDate: new Date().toISOString().split("T")[0],
	paymentTerms: "Net 30 Days",
	description: "",
	items: [],
};

export default function InvoiceForm({
	isOpen,
	onClose,
	onSave,
	onDraft,
	title,
	initialForm,
	submitLabel = "Save & Send",
}) {
	const [form, setForm] = useState(initialForm || defaultForm);
	const [errors, setErrors] = useState({});
	const [globalError, setGlobalError] = useState("");
	const firstRef = useRef(null);

	// Re-sync if initialForm changes (e.g. opening edit with different invoice)
	useEffect(() => {
		if (isOpen) {
			setForm(initialForm || defaultForm);
			setErrors({});
			setGlobalError("");
		}
	}, [isOpen]);

	// ESC to close
	useEffect(() => {
		const handler = (e) => {
			if (e.key === "Escape") onClose();
		};
		if (isOpen) window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [isOpen, onClose]);

	// Focus first field
	useEffect(() => {
		if (isOpen) setTimeout(() => firstRef.current?.focus(), 50);
	}, [isOpen]);

	if (!isOpen) return null;

	const set = (field, value) => {
		setForm((p) => ({ ...p, [field]: value }));
		setErrors((p) => ({ ...p, [field]: undefined }));
		setGlobalError("");
	};

	const setItem = (index, field, value) => {
		setForm((p) => {
			const items = [...p.items];
			items[index] = { ...items[index], [field]: value };
			if (field === "qty" || field === "price") {
				const qty = Number(field === "qty" ? value : items[index].qty) || 0;
				const price =
					parseFloat(field === "price" ? value : items[index].price) || 0;
				items[index].total = (qty * price).toFixed(2);
			}
			return { ...p, items };
		});
		setErrors((p) => {
			const ie = [...(p.itemErrors || [])];
			if (ie[index]) ie[index] = { ...ie[index], [field]: undefined };
			return { ...p, itemErrors: ie };
		});
	};

	const addItem = () =>
		setForm((p) => ({
			...p,
			items: [...p.items, { name: "", qty: 1, price: "0.00", total: "0.00" }],
		}));

	const removeItem = (i) =>
		setForm((p) => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }));

	const handleSave = () => {
		const errs = validateForm(form);
		if (hasErrors(errs)) {
			setErrors(errs);
			setGlobalError("All fields must be completed and valid.");
			return;
		}
		onSave(form);
	};

	const handleDraft = () => {
		if (onDraft) onDraft(form);
	};

	const ic = (field) => (errors[field] ? inputError : inputNormal);

	return (
		<>
			<Backdrop isOpen={isOpen} onClose={onClose} />

			<div
				role="dialog"
				aria-modal="true"
				aria-label={title}
				className="fixed top-0 left-0 h-full w-full max-w-[616px] lg:pl-[103px] bg-white dark:bg-dark-bg z-40 shadow-2xl rounded-r-2xl flex flex-col"
			>
				<div className="px-6 md:px-10 py-10 flex flex-col gap-8 flex-1 overflow-y-auto">
					<h2 className="text-2xl font-bold text-dark-black dark:text-white font-league-spartan">
						{title}
					</h2>

					{/* ── Bill From ── */}
					<section className="flex flex-col gap-4">
						<p className="text-purple-primary font-bold text-sm font-league-spartan">
							Bill From
						</p>

						<Field label="Street Address" error={errors.fromStreet}>
							<input
								ref={firstRef}
								className={ic("fromStreet")}
								value={form.fromStreet}
								onChange={(e) => set("fromStreet", e.target.value)}
							/>
						</Field>

						<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
							<Field label="City" error={errors.fromCity}>
								<input
									className={ic("fromCity")}
									value={form.fromCity}
									onChange={(e) => set("fromCity", e.target.value)}
								/>
							</Field>
							<Field label="Post Code" error={errors.fromPostCode}>
								<input
									className={ic("fromPostCode")}
									value={form.fromPostCode}
									onChange={(e) => set("fromPostCode", e.target.value)}
								/>
							</Field>
							<Field label="Country" error={errors.fromCountry}>
								<input
									className={`${ic("fromCountry")} col-span-2 sm:col-span-1`}
									value={form.fromCountry}
									onChange={(e) => set("fromCountry", e.target.value)}
								/>
							</Field>
						</div>
					</section>

					{/* ── Bill To ── */}
					<section className="flex flex-col gap-4">
						<p className="text-purple-primary font-bold text-sm font-league-spartan">
							Bill To
						</p>

						<Field label="Client's Name" error={errors.clientName}>
							<input
								className={ic("clientName")}
								value={form.clientName}
								onChange={(e) => set("clientName", e.target.value)}
							/>
						</Field>

						<Field label="Client's Email" error={errors.clientEmail}>
							<input
								type="email"
								className={ic("clientEmail")}
								value={form.clientEmail}
								onChange={(e) => set("clientEmail", e.target.value)}
							/>
						</Field>

						<Field label="Street Address" error={errors.toStreet}>
							<input
								className={ic("toStreet")}
								value={form.toStreet}
								onChange={(e) => set("toStreet", e.target.value)}
							/>
						</Field>

						<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
							<Field label="City" error={errors.toCity}>
								<input
									className={ic("toCity")}
									value={form.toCity}
									onChange={(e) => set("toCity", e.target.value)}
								/>
							</Field>
							<Field label="Post Code" error={errors.toPostCode}>
								<input
									className={ic("toPostCode")}
									value={form.toPostCode}
									onChange={(e) => set("toPostCode", e.target.value)}
								/>
							</Field>
							<Field label="Country" error={errors.toCountry}>
								<input
									className={`${ic("toCountry")} col-span-2 sm:col-span-1`}
									value={form.toCountry}
									onChange={(e) => set("toCountry", e.target.value)}
								/>
							</Field>
						</div>
					</section>

					{/* ── Date + Terms ── */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<Field label="Invoice Date" error={errors.invoiceDate}>
							<input
								type="date"
								className={ic("invoiceDate")}
								value={form.invoiceDate}
								onChange={(e) => set("invoiceDate", e.target.value)}
							/>
						</Field>

						<Field label="Payment Terms">
							<div className="relative">
								<select
									className={`${inputNormal} appearance-none pr-10 cursor-pointer`}
									value={form.paymentTerms}
									onChange={(e) => set("paymentTerms", e.target.value)}
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

					{/* ── Description ── */}
					<Field label="Project Description" error={errors.description}>
						<input
							className={ic("description")}
							value={form.description}
							onChange={(e) => set("description", e.target.value)}
						/>
					</Field>

					{/* ── Item List ── */}
					<section className="flex flex-col gap-4">
						<p className="text-light-text-muted font-bold text-base font-league-spartan">
							Item List
						</p>

						{errors.items && (
							<p className="text-red-primary text-xs font-league-spartan">
								{errors.items}
							</p>
						)}

						<div className="hidden sm:grid grid-cols-[1fr_56px_96px_72px_20px] gap-3 text-light-text-muted text-xs font-league-spartan">
							<span>Item Name</span>
							<span>Qty.</span>
							<span>Price</span>
							<span>Total</span>
							<span />
						</div>

						{form.items.map((item, i) => {
							const ie = errors.itemErrors?.[i] || {};
							return (
								<div
									key={i}
									className="flex flex-col sm:grid sm:grid-cols-[1fr_56px_96px_72px_20px] gap-2 sm:gap-3 sm:items-center border-b border-light-text-secondary sm:border-none pb-4 sm:pb-0"
								>
									{/* Item Name */}
									<div>
										<label className="text-light-text-muted text-xs sm:hidden font-league-spartan">
											Item Name
										</label>
										<input
											className={ie.name ? inputError : inputNormal}
											value={item.name}
											onChange={(e) => setItem(i, "name", e.target.value)}
										/>
										{ie.name && (
											<span className="text-red-primary text-xs">
												{ie.name}
											</span>
										)}
									</div>

									{/* Qty / Price / Total / Delete row on mobile */}
									<div className="flex gap-3 items-end">
										<div className="w-16">
											<label className="text-light-text-muted text-xs sm:hidden font-league-spartan">
												Qty.
											</label>
											<input
												className={`${ie.qty ? inputError : inputNormal} text-center px-1`}
												type="number"
												min="1"
												value={item.qty}
												onChange={(e) => setItem(i, "qty", e.target.value)}
											/>
										</div>
										<div className="flex-1">
											<label className="text-light-text-muted text-xs sm:hidden font-league-spartan">
												Price
											</label>
											<input
												className={ie.price ? inputError : inputNormal}
												value={item.price}
												onChange={(e) => setItem(i, "price", e.target.value)}
											/>
										</div>
										<div className="w-16">
											<label className="text-light-text-muted text-xs sm:hidden font-league-spartan">
												Total
											</label>
											<span className="text-light-text-muted font-bold text-sm flex items-center h-[46px]">
												{item.total}
											</span>
										</div>
										<button
											onClick={() => removeItem(i)}
											className="text-light-text-muted hover:text-red-primary transition flex items-center h-[46px]"
											aria-label={`Remove ${item.name || "item"}`}
										>
											<svg
												width="13"
												height="16"
												viewBox="0 0 13 16"
												fill="none"
											>
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
								</div>
							);
						})}

						<button
							onClick={addItem}
							className="w-full py-4 rounded-full bg-light-bg dark:bg-dark-card text-light-text-muted font-bold text-sm hover:bg-light-text-secondary dark:hover:bg-dark-sidebar transition font-league-spartan"
						>
							+ Add New Item
						</button>
					</section>

					{globalError && (
						<p className="text-red-primary text-xs font-league-spartan">
							{globalError}
						</p>
					)}
				</div>

				{/* ── Sticky footer ── */}
				<div className="sticky bottom-0 bg-white dark:bg-dark-bg px-6 md:px-10 py-5 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.08)] gap-3 flex-wrap">
					<button
						onClick={onClose}
						className="px-5 py-3 rounded-full bg-light-bg dark:bg-dark-card text-light-text-muted font-bold text-sm hover:opacity-80 transition font-league-spartan"
					>
						{onDraft ? "Discard" : "Cancel"}
					</button>

					<div className="flex gap-3">
						{onDraft && (
							<button
								onClick={handleDraft}
								className="px-5 py-3 rounded-full bg-gray-primary text-white font-bold text-sm hover:opacity-80 transition font-league-spartan"
							>
								Save as Draft
							</button>
						)}
						<button
							onClick={handleSave}
							className="px-5 py-3 rounded-full bg-purple-primary hover:bg-purple-light text-white font-bold text-sm transition font-league-spartan"
						>
							{submitLabel}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
