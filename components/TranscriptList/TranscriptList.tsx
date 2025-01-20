import React from "react";
import { Transcript } from "@/types";
import { useAtomValue } from "jotai";
import { editorAtom } from "@/atoms";
import { toast } from "sonner";

interface ITranscriptListProps {
	transcript: Transcript | null;
	onTranscriptClick: (time: number) => void;
	videoTime: number;
}

const TranscriptList = (props: ITranscriptListProps) => {
	const editor = useAtomValue(editorAtom);

	if (!props.transcript) {
		return <div>No transcript available</div>;
	}

	const handleSentenceClick = (wordTime: string) => {
		const time = Number(wordTime);
		props.onTranscriptClick(time);
	};

	const formatSecondsToMinutes = (secondsString: string) => {
		const totalSeconds = parseInt(secondsString, 10);

		if (isNaN(totalSeconds) || totalSeconds < 0) {
			throw new Error(
				"Invalid input: Please provide a non-negative number as a string."
			);
		}

		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;

		return `${minutes}m ${seconds}s`;
	};

	const handleToastClick = (text: string) => {
		const comment = prompt("Dein Kommentar: ");

		if (!comment) return;

		console.log("comment", comment);

		editor?.commands.insertContentAt(
			editor?.state.doc.content.size,
			`<blockquote>"${text}"<p> - ${comment}</p></blockquote>`
		);

		toast.dismiss();
		editor?.chain().focus().run();
	};

	const handleMouseDown = () => {
		toast.dismiss();
	};

	// TODO: Should only work on Feedback Creation Page
	const handleMouseUp = () => {
		const activeSelection = document.getSelection();
		const text = activeSelection?.toString();

		if (!activeSelection || !text) {
			toast.dismiss();
			return;
		}

		toast("Comment on this part of the transcript!", {
			action: {
				label: "Comment",
				onClick: () => handleToastClick(text),
			},
		});
	};

	return (
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
								props.videoTime >= Number(sentence.start) &&
								props.videoTime < Number(sentence.end) &&
								props.videoTime < Number(interval.end);

							return (
								<React.Fragment key={sentence.start}>
									<span
										className={`hover:transition-all hover:bg-yellow-300 hover:text-black cursor-pointer ${
											isActiveSentence
												? "bg-yellow-500 text-black"
												: ""
										}`}
										onClick={() =>
											handleSentenceClick(sentence.start)
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
	);
};

export default TranscriptList;
