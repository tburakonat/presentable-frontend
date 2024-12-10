import {
	CommentSection,
	EventList,
	EventsTimeline,
	FeedbackContent,
	TranscriptList,
	VideoDetails,
} from "@/components";
import { useVideoTimestamp } from "@/hooks";
import { Event, Feedback, Transcript, Video } from "@/types";
import { Box, Tab, Tabs } from "@mui/material";
import { GetStaticPropsContext } from "next";
import { useState } from "react";

interface IVideoFeedbackPageProps {
	video: Video;
	feedback: Feedback;
	events: Event | null;
	transcript: Transcript | null;
}

export default function VideoFeedbackPage(props: IVideoFeedbackPageProps) {
	const videoRef = useVideoTimestamp();
	const [value, setValue] = useState(0);
	const [videoTime, setVideoTime] = useState(0);

	const handleTimeUpdate = () => {
		if (videoRef.current) {
			setVideoTime(videoRef.current.currentTime);
		}
	};

	const handleTimestampClick = (time: number) => {
		if (videoRef.current) {
			videoRef.current.currentTime = time;
			videoRef.current.pause();
		}
	};

	return (
		<div className="container mx-auto p-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Left Column: Video and Feedback */}
				<div className="flex flex-col space-y-6">
					<video
						ref={videoRef}
						controls
						className="w-full rounded-lg border border-gray-300 shadow-sm"
						onTimeUpdate={handleTimeUpdate}
					>
						<source src={props.video.videoUrl} type="video/mp4" />
						Your browser does not support the video tag.
					</video>
					<EventsTimeline
						events={props.events}
						onEventClick={handleTimestampClick}
						videoDuration={props.video.videoDuration}
					/>
					<div className="mt-8 p-6 rounded-lg shadow-md dark:bg-slate-800">
						<h2 className="text-xl font-bold mb-4">Feedback</h2>
						<FeedbackContent
							feedback={props.feedback.content}
							onTimestampClick={handleTimestampClick}
						/>
						<p className="text-sm text-gray-500">
							By {props.feedback.createdBy} on{" "}
							{new Date(
								props.feedback.createdAt
							).toLocaleDateString("de-DE")}
						</p>
					</div>
				</div>

				{/* Right Column: Description, Transcription, Events, Comments */}
				<div>
					<Tabs onChange={(_, val) => setValue(val)} value={value}>
						<Tab
							label="Description"
							value={0}
							className="dark:text-white"
						/>
						<Tab
							label="Events"
							value={1}
							className="dark:text-white"
						/>
						<Tab
							label="Transcription"
							value={2}
							className="dark:text-white"
						/>
						<Tab
							label="Comments"
							value={3}
							className="dark:text-white"
						/>
					</Tabs>
					<Box p={2} className="overflow-y-auto max-h-[100vh]">
						{value === 0 && <VideoDetails video={props.video} />}
						{value === 1 && (
							<EventList
								event={props.events}
								onEventClick={handleTimestampClick}
							/>
						)}
						{value === 2 && (
							<TranscriptList
								transcript={props.transcript}
								onTranscriptClick={handleTimestampClick}
								videoTime={videoTime}
							/>
						)}
						{value === 3 && (
							<CommentSection
								feedback={props.feedback}
								onTimestampClick={handleTimestampClick}
							/>
						)}
					</Box>
				</div>
			</div>
		</div>
	);
}

export const getStaticPaths = async () => {
	const res = await fetch("http://localhost:8080/videos");
	const data: Video[] = await res.json();

	const paths = data.flatMap(video => {
		return video.feedback.map(fb => {
			return {
				params: { videoId: video.id.toString(), feedbackId: fb.id },
			};
		});
	});

	return { paths, fallback: false };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
	const { videoId, feedbackId } = context.params!;

	const res = await fetch("http://localhost:8080/videos");
	const data: Video[] = await res.json();
	const video = data.find(v => v.id === videoId);
	const feedback = video?.feedback.find(fb => fb.id === feedbackId);

	const res2 = await fetch("http://localhost:8080/events");
	const data2: Event[] = await res2.json();
	const events = data2.find(event => event.RecordingID === videoId);

	const res3 = await fetch("http://localhost:8080/transcripts");
	const data3: Transcript[] = await res3.json();
	const transcript = data3.find(event => event.RecordingID === videoId);

	return {
		props: {
			video,
			feedback,
			events: events || null,
			transcript: transcript || null,
		},
	};
};
