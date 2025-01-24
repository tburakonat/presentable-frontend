import { Comment, Feedback, User } from "@/types";
import { FeedbackContent } from "../FeedbackContent";
import { useState } from "react";
import {
	useCreateCommentMutation,
	useDeleteCommentMutation,
} from "@/helpers/mutations";
import { useSession } from "@/context";
import React from "react";
import { AnimatePresence, motion } from "motion/react";
import moment from "moment";

interface ICommentSectionProps {
	feedback: Feedback;
	comments: Comment[] | null;
	onTimestampClick: (time: number) => void;
}

export default function CommentSection({
	comments,
	feedback,
	onTimestampClick,
}: ICommentSectionProps) {
	const { user } = useSession();
	const [commentInput, setCommentInput] = useState<string>("");
	const [replyInputs, setReplyInputs] = useState<{
		[key: number]: string | undefined;
	}>({});
	const [visibleReplies, setVisibleReplies] = useState<{
		[key: number]: boolean;
	}>({});
	const { mutate } = useCreateCommentMutation(feedback.id);
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
			setVisibleReplies(prev => ({ ...prev, [commentId]: true }));
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

	const createTooltip = (dateString: string) => {
		const date = new Date(dateString).toLocaleDateString("de-DE", {
			year: "numeric",
			weekday: "long",
			day: "numeric",
			month: "long",
		});
		const time = new Date(dateString).toLocaleTimeString("de-DE", {
			hour: "2-digit",
			minute: "2-digit",
			timeZoneName: "short",
		});

		return `${date} at ${time}`;
	};

	const renderUsername = (createdBy: User) => {
		const username =
			!createdBy.first_name || !createdBy.last_name
				? createdBy.username
				: `${createdBy.first_name} ${createdBy.last_name}`;
		const isFeedbackOwner = createdBy.id === feedback.created_by.id;
		const isPresentationOwner =
			createdBy.id === feedback.presentation.created_by.id;
		const isYourself = createdBy.id === user!.id;
		return `${isYourself ? "You" : username} ${
			isPresentationOwner
				? "(Presentation Owner)"
				: isFeedbackOwner
				? "(Feedback Owner)"
				: ""
		} `;
	};

	const toggleReplies = (commentId: number) => {
		setVisibleReplies(prev => ({
			...prev,
			[commentId]: !prev[commentId],
		}));
	};

	const renderComments = (comments: Comment[]) => {
		const filteredComments = comments.filter(comment => {
			// Include comments that are not deleted or have non-deleted replies
			if (!comment.is_deleted) return true;

			// Check if there are any non-deleted replies
			return comment.replies.some(reply => !reply.is_deleted);
		});
		return filteredComments.map(comment => (
			<React.Fragment key={comment.id}>
				<div className="my-2 border shadow-md rounded-lg p-3">
					<div className="flex flex-col gap-2">
						<p className="text-xs text-gray-500">
							{renderUsername(comment.created_by)}
							{" • "}
							<span
								className="cursor-pointer"
								title={createTooltip(comment.created_at)}
							>
								{moment(comment.created_at).fromNow()}
							</span>
						</p>

						{comment.is_deleted ? (
							<p>
								<i>This comment has been deleted.</i>
							</p>
						) : (
							<p>{comment.content}</p>
						)}

						<div className="flex">
							{comment.replies.length > 0 &&
								comment.replies.some(r => !r.is_deleted) && (
									<div
										className="cursor-pointer"
										onClick={() =>
											toggleReplies(comment.id)
										}
									>
										<i
											className={
												visibleReplies[comment.id]
													? "ri-arrow-down-s-line"
													: "ri-arrow-right-s-line"
											}
										></i>
									</div>
								)}
							<div className="flex gap-4 ml-auto">
								{comment.created_by.id === user!.id && (
									<div
										className="cursor-pointer"
										title="Delete Comment"
										onClick={() =>
											handleDeleteComment(comment.id)
										}
									>
										<i className="ri-delete-bin-line"></i>
									</div>
								)}
								<div
									className="cursor-pointer"
									title="Reply"
									onClick={() => toggleReplyInput(comment.id)}
								>
									<i className="ri-reply-line"></i>
								</div>
							</div>
						</div>
					</div>

					<AnimatePresence>
						{replyInputs[comment.id] !== undefined && (
							<motion.div
								className="mt-2"
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.3 }}
							>
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
										onClick={() =>
											handleAddReply(comment.id)
										}
									>
										Add Reply
									</button>
									<button
										className="mt-2 px-4 py-2 bg-red-500 rounded-lg shadow-md hover:bg-red-600 text-white"
										onClick={() =>
											toggleReplyInput(comment.id)
										}
									>
										Cancel
									</button>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<AnimatePresence>
					{visibleReplies[comment.id] &&
						comment.replies.length > 0 && (
							<motion.div
								className="pl-4 border-l"
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.3 }}
							>
								{renderComments(comment.replies)}
							</motion.div>
						)}
				</AnimatePresence>
			</React.Fragment>
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
			{comments !== null && comments.length > 0 ? (
				<div className="mt-4">
					{renderComments(comments.filter(c => !c.parent_comment))}
				</div>
			) : (
				<div className="mt-4">
					<p>
						No comments yet. Be the first to comment on this
						feedback!
					</p>
				</div>
			)}
		</>
	);
}
