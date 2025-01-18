import { Comment, Feedback } from "@/types";
import { FeedbackContent } from "../FeedbackContent";
import { useState } from "react";
import {
	useCreateCommentMutation,
	useDeleteCommentMutation,
} from "@/helpers/mutations";
import { useSession } from "@/context";

interface ICommentSectionProps {
	feedback: Feedback;
	comments: Comment[] | null;
	onTimestampClick: (time: number) => void;
}

export default function CommentSection(props: ICommentSectionProps) {
	const { user } = useSession();
	const [commentInput, setCommentInput] = useState<string>("");
	const { mutate } = useCreateCommentMutation(props.feedback.id);
	const { mutate: deleteComment } = useDeleteCommentMutation();

	const handleAddComment = async () => {
		try {
			mutate(commentInput);
			setCommentInput("");
		} catch (error) {
			console.error(error);
		}
	};

	const handleDeleteComment = async (commentId: string) => {
		try {
			deleteComment(parseInt(commentId));
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<h2 className="text-xl font-bold mb-2">Comments</h2>
			<div>
				<textarea
					value={commentInput}
					onChange={e => setCommentInput(e.target.value)}
					placeholder="Write a comment..."
					className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 text-black"
					rows={3}
				></textarea>
				<button
					className="mt-2 px-4 py-2 bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 text-white"
					onClick={handleAddComment}
				>
					Add Comment
				</button>
			</div>
			{props.comments !== null && props.comments.length > 0 ? (
				props.comments
					.toSorted(
						(a, b) =>
							new Date(b.created_at).getTime() -
							new Date(a.created_at).getTime()
					)
					.map((comment, index) => (
						<div
							key={index}
							className={`p-3 my-2 rounded-lg shadow-md border-l-4 border-blue-500 dark:bg-slate-900`}
						>
							<div className="flex justify-between">
								<FeedbackContent
									feedback={comment.content}
									onTimestampClick={props.onTimestampClick}
								/>
								{user!.id === comment.created_by.id && (
									<span
										className="cursor-pointer"
										onClick={() =>
											handleDeleteComment(comment.id)
										}
									>
										<i className="ri-delete-bin-line"></i>
									</span>
								)}
							</div>
							<p className="text-sm text-gray-500">
								By {comment.created_by.first_name}{" "}
								{comment.created_by.last_name} on{" "}
								{new Date(
									comment.created_at
								).toLocaleDateString("de-DE")}{" "}
								{new Date(
									comment.created_at
								).toLocaleTimeString("de-DE", {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</p>
						</div>
					))
			) : (
				<p>No comments yet. Be the first to comment!</p>
			)}
		</>
	);
}
