import { BrowserRouter, Routes, Route } from "react-router-dom";
import InvoiceList from "../features/invoices/pages/invoiceList";
import ViewInvoice from "../features/invoices/pages/invoiceDetail";

export default function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<InvoiceList />} />
			<Route path="/invoice/:id" element={<ViewInvoice />} />
		</Routes>
	);
}
