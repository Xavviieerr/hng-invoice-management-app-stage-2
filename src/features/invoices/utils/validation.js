export function validateForm(form) {
	const errors = {};

	// Bill From
	if (!form.fromStreet?.trim())
		errors.fromStreet = "Street address is required";
	if (!form.fromCity?.trim()) errors.fromCity = "City is required";
	if (!form.fromPostCode?.trim()) errors.fromPostCode = "Post code is required";
	if (!form.fromCountry?.trim()) errors.fromCountry = "Country is required";

	// Bill To
	if (!form.clientName?.trim()) errors.clientName = "Client name is required";
	if (!form.clientEmail?.trim()) {
		errors.clientEmail = "Client email is required";
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)) {
		errors.clientEmail = "Enter a valid email address";
	}
	if (!form.toStreet?.trim()) errors.toStreet = "Street address is required";
	if (!form.toCity?.trim()) errors.toCity = "City is required";
	if (!form.toPostCode?.trim()) errors.toPostCode = "Post code is required";
	if (!form.toCountry?.trim()) errors.toCountry = "Country is required";

	// Invoice info
	if (!form.invoiceDate) errors.invoiceDate = "Invoice date is required";
	if (!form.description?.trim()) errors.description = "Description is required";

	// Items
	if (!form.items || form.items.length === 0) {
		errors.items = "At least one item is required";
	} else {
		const itemErrors = form.items.map((item) => {
			const e = {};
			if (!item.name?.trim()) e.name = "Item name required";
			if (!item.qty || Number(item.qty) <= 0) e.qty = "Must be > 0";
			if (!item.price || Number(item.price) <= 0) e.price = "Must be > 0";
			return e;
		});
		const hasItemErrors = itemErrors.some((e) => Object.keys(e).length > 0);
		if (hasItemErrors) errors.itemErrors = itemErrors;
	}

	return errors;
}

export function hasErrors(errors) {
	return Object.keys(errors).length > 0;
}
