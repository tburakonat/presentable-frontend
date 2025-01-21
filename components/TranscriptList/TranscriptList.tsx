import React from "react";
import { Transcript } from "@/types";
import { useAtomValue } from "jotai";
import { editorAtom } from "@/atoms";
import { toast } from "sonner";
import { convertTimestampToSeconds } from "@/helpers/helpers";
import { useRouter } from "next/router";

interface ITranscriptListProps {
	transcript: Transcript | null;
	onTranscriptClick: (time: number) => void;
	videoTime: number;
}

const TranscriptList = (props: ITranscriptListProps) => {
	const router = useRouter();
	const editor = useAtomValue(editorAtom);

	if (!props.transcript) {
		return <div>No transcript available</div>;
	}

	const handleSentenceClick = (timestamp: string) => {
		const seconds = convertTimestampToSeconds(timestamp);
		props.onTranscriptClick(seconds);
	};

	const formatSecondsToMinutes = (timestamp: string) => {
		const [hours, minutes, seconds] = timestamp.split(":").map(parseFloat);

		if (
			isNaN(hours) ||
			isNaN(minutes) ||
			isNaN(seconds) ||
			hours < 0 ||
			minutes < 0 ||
			seconds < 0
		) {
			throw new Error(
				"Invalid input: Please provide a valid timestamp in the format HH:MM:SS.sss"
			);
		}

		const totalSeconds = hours * 3600 + minutes * 60 + seconds;
		const displayMinutes = Math.floor(totalSeconds / 60);
		const displaySeconds = Math.floor(totalSeconds % 60);

		return `${displayMinutes}m ${displaySeconds}s`;
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
								props.videoTime >=
									convertTimestampToSeconds(sentence.start) &&
								props.videoTime <
									convertTimestampToSeconds(sentence.end) &&
								props.videoTime <
									convertTimestampToSeconds(interval.end);

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
