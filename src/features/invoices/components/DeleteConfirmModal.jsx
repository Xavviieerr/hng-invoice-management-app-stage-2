import { useEffect, useRef } from "react";
import Backdrop from "./BackdropComponent";

export default function DeleteConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	invoiceId,
}) {
	const cancelRef = useRef(null);

	// Focus cancel on open
	useEffect(() => {
		if (isOpen) cancelRef.current?.focus();
	}, [isOpen]);

	// Close on ESC
	useEffect(() => {
		const handler = (e) => {
			if (e.key === "Escape") onClose();
		};
		if (isOpen) window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<>
			<Backdrop isOpen={isOpen} onClose={onClose} />

			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="delete-title"
				className="fixed inset-0 z-50 flex items-center justify-center px-4"
			>
				<div className="w-full max-w-md bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 flex flex-col gap-6">
					<h2
						id="delete-title"
						className="text-xl font-bold text-dark-black dark:text-white"
					>
						Confirm Deletion
					</h2>

					<p className="text-sm text-light-text-muted leading-relaxed">
						Are you sure you want to delete invoice{" "}
						<span className="font-bold text-dark-black dark:text-white">
							#{invoiceId}
						</span>
						? This action cannot be undone.
					</p>

					<div className="flex justify-end gap-3">
						<button
							ref={cancelRef}
							onClick={onClose}
							className="px-6 py-3 rounded-full bg-light-bg dark:bg-dark-bg text-light-text-muted font-bold text-sm hover:opacity-80 transition"
						>
							Cancel
						</button>
						<button
							onClick={onConfirm}
							className="px-6 py-3 rounded-full bg-red-primary text-white font-bold text-sm hover:bg-red-light transition"
						>
							Delete
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
