import {
	Editor,
	EventList,
	EventsTimeline,
	TranscriptList,
	VideoDetails,
} from "@/components";
import { useVideoTimestamp } from "@/hooks";
import { Event, Transcript, Video, VideoTab } from "@/types";
import { Tabs, Tab, Box } from "@mui/material";
import { GetStaticPathsResult, GetStaticPropsContext } from "next";
import { useState } from "react";

import fs from "fs";
import path from "path";
import Link from "next/link";

export default function CreateVideoFeedbackPage(props: {
	video: Video;
	events: Event | null;
	transcript: Transcript | null;
}) {
	const videoRef = useVideoTimestamp();
	const [value, setValue] = useState(VideoTab.Description);
	const [videoTime, setVideoTime] = useState(0);

	const handleTimeUpdate = () => {
		if (videoRef.current) {
			setVideoTime(videoRef.current.currentTime);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
	};

	const handleTimestampClick = (time: number) => {
		if (videoRef.current) {
			videoRef.current.currentTime = time;
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
					<Editor />
					<button
						type="submit"
						className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 self-start"
						onClick={handleSubmit}
					>
						Submit Feedback
					</button>
				</div>

				{/* Right Column: Tabs for Description, Transcription, Events */}
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
					</Box>
				</div>
			</div>

			<div className="space-y-4"></div>
		</div>
	);
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
	const dataDirectory = path.join(process.cwd(), "data");
	const filePath = path.join(dataDirectory, "videos.json");
	const fileContents = fs.readFileSync(filePath, "utf-8");
	const videos: Video[] = JSON.parse(fileContents);

	const paths = videos.map(video => ({
		params: { videoId: video.id.toString() },
	}));

	return { paths, fallback: false };
}

export async function getStaticProps(context: GetStaticPropsContext) {
	const { videoId } = context.params!;

	const dataDirectory = path.join(process.cwd(), "data");
	const videosFilePath = path.join(dataDirectory, "videos.json");
	const videoFileContents = fs.readFileSync(videosFilePath, "utf-8");
	const videos: Video[] = JSON.parse(videoFileContents);
	const video = videos.find(v => v.id === videoId);

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
			events: events || null,
			transcript: transcript || null,
		},
	};
}
