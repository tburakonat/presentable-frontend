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
	const transcriptListRef = useRef<HTMLDivElement | null>(null);
	const editor = useAtomValue(editorAtom);
	const activeSentenceRef = useRef<HTMLSpanElement | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedText, setSelectedText] = useState("");
	const [selectionCoords, setSelectionCoords] = useState<{
		top: number;
		left: number;
	} | null>(null);

	// useEffect(() => {
	// 	if (activeSentenceRef.current) {
	// 		activeSentenceRef.current.scrollIntoView({
	// 			behavior: "smooth",
	// 			block: "center",
	// 		});
	// 	}
	// }, [props.videoTime]);

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

		const selection = window.getSelection();
		const text = selection?.toString().trim();

		if (!selection || !text) {
			setSelectionCoords(null);
			return;
		}

		const range = selection.getRangeAt(0);
		const selectionRect = range.getBoundingClientRect();

		// Finde das nächste übergeordnete <div>, das die Section enthält
		let parentDiv = selection.anchorNode?.parentElement;
		while (
			parentDiv &&
			!parentDiv.classList.contains("section-container")
		) {
			parentDiv = parentDiv.parentElement;
		}

		if (!parentDiv) return;

		const containerRect = parentDiv.getBoundingClientRect();

		setSelectedText(text);
		setSelectionCoords({
			top: selectionRect.top + window.scrollY,
			left: containerRect.right + window.scrollX + 10,
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
				onClose={() => {
					setIsModalOpen(false);
					setSelectionCoords(null);
				}}
				onSave={handleSaveComment}
				text={selectedText}
			/>
			<div className="space-y-4 " ref={transcriptListRef}>
				{props.transcript.Intervals.map(interval => {
					return (
						<div
							key={interval.text}
							className="p-4 mb-4 border border-gray-200 rounded-md dark:bg-slate-800 text-pretty text-justify section-container"
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
							{selectionCoords && (
								<button
									style={{
										position: "absolute",
										top: selectionCoords.top,
										left: selectionCoords.left,
										background: "yellow",
										border: "1px solid black",
										padding: "4px 8px",
										cursor: "pointer",
										zIndex: 1000,
									}}
									onClick={() => setIsModalOpen(true)}
								>
									💬
								</button>
							)}
						</div>
					);
				})}
			</div>
		</>
	);
};

export default TranscriptList;
