export default function Backdrop({ isOpen, onClose }) {
	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
			onClick={onClose}
		/>
	);
}
