import { useState } from "react";
import { toast } from "sonner";

const CommentModal = ({ isOpen, onClose, onSave, text }: any) => {
	const [comment, setComment] = useState("");

	const handleSave = () => {
		if (comment.trim() === "") {
			toast.error("Comment cannot be empty!");
			return;
		}
		onSave(comment);
		onClose();
		setComment("");
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-md w-96">
				<h2 className="text-lg font-bold mb-4">Add a Comment</h2>
				<p className="text-sm text-gray-500 mb-4">
					Selected Text: <span className="font-medium">{text}</span>
				</p>
				<textarea
					className="w-full border p-2 rounded-md mb-4"
					placeholder="Enter your comment here..."
					value={comment}
					onChange={e => setComment(e.target.value)}
				/>
				<div className="flex justify-end space-x-2">
					<button
						className="px-4 py-2 bg-gray-300 rounded-md"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						className="px-4 py-2 bg-blue-500 text-white rounded-md"
						onClick={handleSave}
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
};

export default CommentModal;
