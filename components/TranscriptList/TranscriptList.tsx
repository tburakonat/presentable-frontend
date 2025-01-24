import React, { useEffect, useRef, useState } from "react";
import { Transcript } from "@/types";
import { useAtomValue } from "jotai";
import { editorAtom } from "@/atoms";
import { toast } from "sonner";
import { convertTimestampToSeconds } from "@/helpers/helpers";
import { useRouter } from "next/router";
import { CommentModal } from "@/components";

interface ITranscriptListProps {
	transcript: Transcript | null;
	onTranscriptClick: (time: number) => void;
	videoTime: number;
}

const TranscriptList = (props: ITranscriptListProps) => {
	const router = useRouter();
	const editor = useAtomValue(editorAtom);
	const activeSentenceRef = useRef<HTMLSpanElement | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedText, setSelectedText] = useState("");

	useEffect(() => {
		if (activeSentenceRef.current) {
			activeSentenceRef.current.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}
	}, [props.videoTime]);

	if (!props.transcript) {
		return <div>No transcript available</div>;
	}

	const handleSentenceClick = (timestamp: string) => {
		const seconds = convertTimestampToSeconds(timestamp);
		props.onTranscriptClick(seconds);
	};

	const formatSecondsToMinutes = (timestamp: string) => {
		const seconds = convertTimestampToSeconds(timestamp);
		const displayMinutes = Math.floor(seconds / 60);
		const displaySeconds = Math.floor(seconds % 60);

		return `${displayMinutes}m ${displaySeconds}s`;
	};

	const handleMouseDown = () => {
		if (!router.asPath.includes("new")) return;
		toast.dismiss();
	};

	const handleMouseUp = () => {
		if (!router.asPath.includes("new")) return;
		const activeSelection = document.getSelection();
		const text = activeSelection?.toString();

		if (!activeSelection || !text) {
			toast.dismiss();
			return;
		}

		toast("Comment on this part of the transcript!", {
			action: {
				label: "Comment",
				onClick: () => {
					setSelectedText(text);
					setIsModalOpen(true);
				},
			},
		});
	};

	const handleSaveComment = (comment: string) => {
		editor?.commands.insertContentAt(
			editor?.state.doc.content.size,
			`<blockquote>"${selectedText}"<p> - ${comment}</p></blockquote>`
		);

		toast.dismiss();
		editor?.chain().focus().run();
		toast.success("Comment added successfully!");
	};

	return (
		<>
			<CommentModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSaveComment}
				text={selectedText}
			/>
			<div className="space-y-4 ">
				{props.transcript.Intervals.map(interval => {
					return (
						<div
							key={interval.text}
							className="p-4 mb-4 border border-gray-200 rounded-md dark:bg-slate-800 text-pretty text-justify"
							onMouseDown={handleMouseDown}
							onMouseUp={handleMouseUp}
						>
							<p className="mb-1">
								{formatSecondsToMinutes(interval.start)}
							</p>
							{interval.sentences.map(sentence => {
								const isActiveSentence =
									props.videoTime >=
										convertTimestampToSeconds(
											sentence.start
										) &&
									props.videoTime <
										convertTimestampToSeconds(
											sentence.end
										) &&
									props.videoTime <
										convertTimestampToSeconds(interval.end);

								return (
									<React.Fragment key={sentence.start}>
										<span
											ref={
												isActiveSentence
													? activeSentenceRef
													: null
											}
											className={`hover:transition-all hover:bg-yellow-300 hover:text-black cursor-pointer ${
												isActiveSentence
													? "bg-yellow-500 text-black"
													: ""
											}`}
											onClick={() =>
												handleSentenceClick(
													sentence.start
												)
											}
										>
											{sentence.text}
										</span>
										<span> </span>
									</React.Fragment>
								);
							})}
						</div>
					);
				})}
			</div>
		</>
	);
};

export default TranscriptList;
