import InvoiceItem from "../components/InvoiceItem";
export default function InvoiceList() {
	const invoices = [
		{ id: 1, name: "Invoice 1", amount: "$100" },
		{ id: 2, name: "Invoice 2", amount: "$200" },
	];
	return (
		<div>
			<h1 className="font-league-spartan font-bold text-4xl text-red-600 dark:text-black ">
				Invoice List
			</h1>
			{invoices.map((invoice) => (
				<InvoiceItem key={invoice.id} invoice={invoice} />
			))}
			<hr />
		</div>
	);
}
