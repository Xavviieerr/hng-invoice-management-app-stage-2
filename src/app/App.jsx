import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "../context/themeContext";
import { InvoiceProvider } from "../context/InvoiceContext";
import AppLayout from "./AppLayout";
import InvoiceList from "../features/invoices/pages/invoiceList";
import InvoiceDetail from "../features/invoices/pages/invoiceDetail";

export default function App() {
	return (
		<ThemeProvider>
			<InvoiceProvider>
				<BrowserRouter>
					<AppLayout>
						<Routes>
							<Route path="/" element={<InvoiceList />} />
							<Route path="/invoice/:id" element={<InvoiceDetail />} />
						</Routes>
					</AppLayout>
				</BrowserRouter>
			</InvoiceProvider>
		</ThemeProvider>
	);
}
