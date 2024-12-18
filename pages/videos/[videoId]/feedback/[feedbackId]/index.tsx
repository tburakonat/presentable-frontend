import {
	CommentSection,
	EventList,
	EventsTimeline,
	FeedbackContent,
	TranscriptList,
	VideoDetails,
} from "@/components";
import { useVideoTimestamp } from "@/hooks";
import { Event, Feedback, Transcript, Video, VideoTab } from "@/types";
import { Box, Tab, Tabs } from "@mui/material";
import { GetStaticPropsContext } from "next";
import { useEffect, useState } from "react";

import fs from "fs";
import path from "path";
import Link from "next/link";

interface IVideoFeedbackPageProps {
	video: Video;
	feedback: Feedback;
	events: Event | null;
	transcript: Transcript | null;
}

export default function VideoFeedbackPage(props: IVideoFeedbackPageProps) {
	const videoRef = useVideoTimestamp();
	const [value, setValue] = useState<VideoTab>(VideoTab.Description);
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
							className="dark:text-white"
							value={VideoTab.Description}
							href={VideoTab.Description}
							LinkComponent={Link}
						/>
						<Tab
							label="Events"
							className="dark:text-white"
							value={VideoTab.Events}
							href={VideoTab.Events}
							LinkComponent={Link}
						/>
						<Tab
							label="Transcription"
							className="dark:text-white"
							value={VideoTab.Transcription}
							href={VideoTab.Transcription}
							LinkComponent={Link}
						/>
						<Tab
							label="Comments"
							className="dark:text-white"
							value={VideoTab.Comments}
							href={VideoTab.Comments}
							LinkComponent={Link}
						/>
					</Tabs>
					<Box p={2} className="overflow-y-auto max-h-[100vh]">
						{value === VideoTab.Description && (
							<VideoDetails video={props.video} />
						)}
						{value === VideoTab.Events && (
							<EventList
								event={props.events}
								onEventClick={handleTimestampClick}
							/>
						)}
						{value === VideoTab.Transcription && (
							<TranscriptList
								transcript={props.transcript}
								onTranscriptClick={handleTimestampClick}
								videoTime={videoTime}
							/>
						)}
						{value === VideoTab.Comments && (
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
	const dataDirectory = path.join(process.cwd(), "data");
	const filePath = path.join(dataDirectory, "videos.json");
	const fileContents = fs.readFileSync(filePath, "utf-8");
	const videos: Video[] = JSON.parse(fileContents);

	const paths = videos.flatMap(video => {
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

	const dataDirectory = path.join(process.cwd(), "data");
	const videosFilePath = path.join(dataDirectory, "videos.json");
	const videoFileContents = fs.readFileSync(videosFilePath, "utf-8");
	const videos: Video[] = JSON.parse(videoFileContents);
	const video = videos.find(v => v.id === videoId);

	const feedback = video?.feedback.find(fb => fb.id === feedbackId);

	const eventsFilePath = path.join(dataDirectory, "events.json");
	const eventsFileContent = fs.readFileSync(eventsFilePath, "utf-8");
	const allEvents: Event[] = JSON.parse(eventsFileContent);
	const events = allEvents.find(event => event.RecordingID === videoId);

	const transcriptsFilePaths = path.join(dataDirectory, "transcripts.json");
	const transcriptsContent = fs.readFileSync(transcriptsFilePaths, "utf-8");
	const transcripts: Event[] = JSON.parse(transcriptsContent);
	const transcript = transcripts.find(event => event.RecordingID === videoId);

	return {
		props: {
			video,
			feedback,
			events: events || null,
			transcript: transcript || null,
		},
	};
};
