import { Link } from "react-router-dom";

export default function InvoiceItem({ invoice }) {
	return (
		<Link to={`/invoice/${invoice.id} `}>
			<div>
				<h3>{invoice.name}</h3>
				<p>{invoice.amount}</p>
			</div>
		</Link>
	);
}
