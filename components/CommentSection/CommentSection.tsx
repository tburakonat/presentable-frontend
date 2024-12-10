import { Feedback } from "@/types";
import { FeedbackContent } from "../FeedbackContent";
import { useState } from "react";

interface ICommentSectionProps {
    feedback: Feedback;
    onTimestampClick: (time: number) => void;
}

export default function CommentSection(props: ICommentSectionProps) {
	const [commentInput, setCommentInput] = useState<string>("");

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
                >
                    Add Comment
                </button>
            </div>
            {props.feedback.comments.length > 0 ? (
                props.feedback.comments.map((comment, index) => (
                    <div
                        key={index}
                        className={`p-3 my-2 rounded-lg shadow-md border-l-4 border-blue-500 dark:bg-slate-900`}
                    >
                        <FeedbackContent
                            feedback={comment.content}
                            onTimestampClick={props.onTimestampClick}
                        />
                        <p className="text-sm text-gray-500">
                            By {comment.createdBy} on{" "}
                            {new Date(
                                comment.createdAt
                            ).toLocaleDateString("de-DE")}{" "}
                            {new Date(
                                comment.createdAt
                            ).toLocaleTimeString("de-DE")}
                        </p>
                    </div>
                ))
            ) : (
                <p>
                    No comments yet. Be the first to comment!
                </p>
            )}
        </>
    )
}