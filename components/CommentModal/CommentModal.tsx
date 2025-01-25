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
		<div
			tabIndex={-1}
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
		>
			<div className="relative p-4 w-full max-w-md max-h-full">
				<div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
					<div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
							Create comment on selected text
						</h3>
						<button
							type="button"
							onClick={onClose}
							className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
							data-modal-hide="authentication-modal"
						>
							<svg
								className="w-3 h-3"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 14 14"
							>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
								/>
							</svg>
							<span className="sr-only">Close modal</span>
						</button>
					</div>
					{/* <!-- Modal body --> */}
					<div className="p-4 md:p-5">
						<div className="space-y-4">
							<div>
								<label
									htmlFor="selected-text"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Selected Text
								</label>
								<p className="text-gray-900 dark:text-white">
									{text}
								</p>
							</div>
							<div>
								<label
									htmlFor="comment"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Your comment
								</label>
								<input
									type="text"
									name="comment"
									id="comment"
									value={comment}
									onChange={e => setComment(e.target.value)}
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
								/>
							</div>
							<button
								type="submit"
								onClick={handleSave}
								className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							>
								Create Comment
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CommentModal;
