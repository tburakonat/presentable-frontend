import React from "react";
import { Transcript } from "@/types";

interface ITranscriptListProps {
	transcript: Transcript | null;
	onTranscriptClick: (time: number) => void;
	videoTime: number;
}

const TranscriptList = (props: ITranscriptListProps) => {
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

	return (
		<div className="space-y-4 ">
			{props.transcript.Intervals.map(interval => {
				// const isActiveInterval =
				// 	props.videoTime >= Number(interval.start) &&
				// 	props.videoTime < Number(interval.end) &&
				// 	props.videoTime < Number(interval.end);

				return (
					<div
						key={interval.text}
						className="p-4 mb-4 border border-gray-200 rounded-md dark:bg-slate-800 text-pretty text-justify"
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
