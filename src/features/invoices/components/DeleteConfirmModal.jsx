import Backdrop from "./BackdropComponent";

export default function DeleteConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	invoiceId = "XM9141",
}) {
	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<Backdrop isOpen={isOpen} onClose={onClose} />

			{/* Modal */}
			<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
				<div className="w-full max-w-md bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 flex flex-col gap-6">
					{/* Title */}
					<h2 className="text-xl font-bold text-dark-black dark:text-white">
						Confirm Deletion
					</h2>

					{/* Message */}
					<p className="text-sm text-light-text-muted leading-relaxed">
						Are you sure you want to delete invoice{" "}
						<span className="font-bold text-dark-black dark:text-white">
							#{invoiceId}
						</span>
						? This action cannot be undone.
					</p>

					{/* Actions */}
					<div className="flex justify-end gap-3">
						<button
							onClick={onClose}
							className="px-6 py-3 rounded-full bg-light-bg dark:bg-dark-bg text-light-text-muted font-bold text-sm hover:opacity-80 transition"
						>
							Cancel
						</button>

						<button
							onClick={onConfirm}
							className="px-6 py-3 rounded-full bg-red-primary text-white font-bold text-sm hover:opacity-90 transition"
						>
							Delete
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
