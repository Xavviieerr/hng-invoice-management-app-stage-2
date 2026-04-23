import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "invoice_app_invoices";

const defaultInvoices = [
	{
		id: "RT3082",
		date: "Due 15 Aug 2021",
		name: "Elon Musk",
		amount: "5,120.50",
		status: "paid",
		description: "Graphic Design",
		invoiceDate: "2021-08-15",
		paymentDue: "15 Sep 2021",
		paymentTerms: "Net 30 Days",
		sentTo: "elon@spacex.com",
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
		items: [
			{ name: "Banner Design", qty: 1, price: "156.00", total: "156.00" },
			{ name: "Email Design", qty: 2, price: "200.00", total: "400.00" },
			{ name: "Logo Design", qty: 1, price: "4564.50", total: "4564.50" },
		],
	},
	{
		id: "RT3081",
		date: "Due 12 Aug 2021",
		name: "Ada Lovelace",
		amount: "2,300.00",
		status: "pending",
		description: "Web Development",
		invoiceDate: "2021-07-12",
		paymentDue: "12 Aug 2021",
		paymentTerms: "Net 30 Days",
		sentTo: "ada@lovelace.com",
		fromAddress: {
			street: "19 Union Terrace",
			city: "London",
			postCode: "E1 3EZ",
			country: "United Kingdom",
		},
		billTo: {
			name: "Ada Lovelace",
			street: "22 Tech Ave",
			city: "Manchester",
			postCode: "M1 2AB",
			country: "United Kingdom",
		},
		items: [
			{ name: "Frontend Build", qty: 1, price: "1500.00", total: "1500.00" },
			{ name: "API Integration", qty: 1, price: "800.00", total: "800.00" },
		],
	},
	{
		id: "RT3080",
		date: "Due 10 Aug 2021",
		name: "Jensen Huang",
		amount: "1,800.90",
		status: "draft",
		description: "Brand Identity",
		invoiceDate: "2021-07-10",
		paymentDue: "10 Aug 2021",
		paymentTerms: "Net 30 Days",
		sentTo: "jensen@nvidia.com",
		fromAddress: {
			street: "19 Union Terrace",
			city: "London",
			postCode: "E1 3EZ",
			country: "United Kingdom",
		},
		billTo: {
			name: "Jensen Huang",
			street: "1 GPU Lane",
			city: "Bristol",
			postCode: "BS1 4AA",
			country: "United Kingdom",
		},
		items: [
			{ name: "Logo Design", qty: 1, price: "900.00", total: "900.00" },
			{ name: "Style Guide", qty: 1, price: "900.90", total: "900.90" },
		],
	},
];

function generateId() {
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const prefix =
		letters[Math.floor(Math.random() * 26)] +
		letters[Math.floor(Math.random() * 26)];
	const number = Math.floor(1000 + Math.random() * 9000);
	return `${prefix}${number}`;
}

function calcAmountDue(items) {
	const total = items.reduce((sum, item) => {
		return sum + Number(item.qty) * parseFloat(item.price || 0);
	}, 0);
	return total.toLocaleString("en-GB", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

function addDays(dateStr, days) {
	const d = new Date(dateStr);
	d.setDate(d.getDate() + days);
	return d.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

function termsToDays(terms) {
	const map = {
		"Net 1 Day": 1,
		"Net 7 Days": 7,
		"Net 14 Days": 14,
		"Net 30 Days": 30,
	};
	return map[terms] || 30;
}

const InvoiceContext = createContext(null);

export function InvoiceProvider({ children }) {
	const [invoices, setInvoices] = useState(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			return stored ? JSON.parse(stored) : defaultInvoices;
		} catch {
			return defaultInvoices;
		}
	});

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
	}, [invoices]);

	const getInvoice = (id) => invoices.find((inv) => inv.id === id);

	const createInvoice = (form, status = "pending") => {
		const id = generateId();
		const amount = calcAmountDue(form.items);
		const days = termsToDays(form.paymentTerms);
		const paymentDue = addDays(form.invoiceDate, days);
		const newInvoice = {
			...form,
			id,
			amount,
			status,
			date: `Due ${paymentDue}`,
			paymentDue,
		};
		setInvoices((prev) => [newInvoice, ...prev]);
		return newInvoice;
	};

	const updateInvoice = (id, form) => {
		const amount = calcAmountDue(form.items);
		const days = termsToDays(form.paymentTerms);
		const paymentDue = addDays(form.invoiceDate, days);
		setInvoices((prev) =>
			prev.map((inv) =>
				inv.id === id
					? { ...inv, ...form, amount, date: `Due ${paymentDue}`, paymentDue }
					: inv,
			),
		);
	};

	const deleteInvoice = (id) => {
		setInvoices((prev) => prev.filter((inv) => inv.id !== id));
	};

	const markAsPaid = (id) => {
		setInvoices((prev) =>
			prev.map((inv) => (inv.id === id ? { ...inv, status: "paid" } : inv)),
		);
	};

	const saveDraft = (form) => {
		return createInvoice(form, "draft");
	};

	return (
		<InvoiceContext.Provider
			value={{
				invoices,
				getInvoice,
				createInvoice,
				updateInvoice,
				deleteInvoice,
				markAsPaid,
				saveDraft,
			}}
		>
			{children}
		</InvoiceContext.Provider>
	);
}

export function useInvoices() {
	const ctx = useContext(InvoiceContext);
	if (!ctx) throw new Error("useInvoices must be used inside InvoiceProvider");
	return ctx;
}
