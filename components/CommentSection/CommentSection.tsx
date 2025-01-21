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
	const [replyInputs, setReplyInputs] = useState<{
		[key: number]: string | undefined;
	}>({});
	const { mutate } = useCreateCommentMutation(props.feedback.id);
	const { mutate: deleteComment } = useDeleteCommentMutation();

	const handleAddComment = async () => {
		try {
			mutate({ content: commentInput, repliesTo: null });
			setCommentInput("");
		} catch (error) {
			console.error(error);
		}
	};

	const handleDeleteComment = async (commentId: number) => {
		try {
			deleteComment(commentId);
		} catch (error) {
			console.error(error);
		}
	};

	const handleAddReply = (commentId: number) => {
		try {
			const replyContent = replyInputs[commentId];
			if (!replyContent) return;
			mutate({ content: replyContent, repliesTo: commentId });
			setReplyInputs(prev => ({ ...prev, [commentId]: undefined }));
		} catch (error) {
			console.error(error);
		}
	};

	const toggleReplyInput = (commentId: number) => {
		setReplyInputs(prev => ({
			...prev,
			[commentId]: prev[commentId] === undefined ? "" : undefined,
		}));
	};

	const renderComments = (
		comments: Comment[],
		parentId: number | null = null,
		level: number = 0
	) => {
		// Filter comments that are replies to the given parentId
		const filteredComments = comments.filter(
			comment => comment.parent_comment === parentId
		);

		// Render each comment and its replies recursively
		return filteredComments.map(comment => (
			<div
				key={comment.id}
				className={`p-3 my-2 rounded-lg shadow-md border-l-4 ${
					level === 0 ? "border-blue-500" : "border-gray-500"
				} dark:bg-slate-900`}
				style={{ marginLeft: `${level * 20}px` }}
			>
				<div className="flex justify-between">
					<FeedbackContent
						feedback={comment.content}
						onTimestampClick={props.onTimestampClick}
					/>
					<div className="flex space-x-2">
						{user!.id === comment.created_by.id && (
							<span
								className="cursor-pointer"
								onClick={() => handleDeleteComment(comment.id)}
							>
								<i className="ri-delete-bin-line"></i>
							</span>
						)}
						<span
							className="cursor-pointer"
							onClick={() => toggleReplyInput(comment.id)}
						>
							<i className="ri-reply-line"></i>
						</span>
					</div>
				</div>
				<p className="text-sm text-gray-500">
					By {comment.created_by.first_name}{" "}
					{comment.created_by.last_name} on{" "}
					{new Date(comment.created_at).toLocaleDateString("de-DE")}{" "}
					{new Date(comment.created_at).toLocaleTimeString("de-DE", {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</p>
				{/* Reply Input */}
				{replyInputs[comment.id] !== undefined && (
					<div className="mt-2">
						<textarea
							value={replyInputs[comment.id]}
							onChange={e =>
								setReplyInputs(prev => ({
									...prev,
									[comment.id]: e.target.value,
								}))
							}
							placeholder="Write a reply..."
							className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 text-black"
							rows={2}
						></textarea>
						<div className="flex justify-end space-x-2">
							<button
								className="mt-2 px-4 py-2 bg-green-500 rounded-lg shadow-md hover:bg-green-600 text-white"
								onClick={() => handleAddReply(comment.id)}
							>
								Add Reply
							</button>
							<button
								className="mt-2 px-4 py-2 bg-red-500 rounded-lg shadow-md hover:bg-red-600 text-white"
								onClick={() => toggleReplyInput(comment.id)}
							>
								Cancel
							</button>
						</div>
					</div>
				)}
				{/* Recursively render replies */}
				{comment.replies && comment.replies.length > 0 && (
					<div className="ml-4">
						{renderComments(comment.replies, comment.id, level + 1)}
					</div>
				)}
			</div>
		));
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
				renderComments(props.comments)
			) : (
				<p>No comments yet. Be the first to comment!</p>
			)}
		</>
	);
}
