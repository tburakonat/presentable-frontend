import Head from "next/head";
import {
	VideoFeedbackSection,
	VideoDetails,
	EventList,
	TranscriptList,
	EventsTimeline,
} from "@/components";
import { Event, Transcript, Video } from "@/types";
import { GetStaticPathsResult, GetStaticPropsContext } from "next";
import { useVideoTimestamp } from "@/hooks";
import { Tab, Tabs } from "@mui/material";
import { useState } from "react";

import fs from 'fs';
import path from 'path';

export default function VideoDetailsPage(props: {
	video: Video;
	events: Event | null;
	transcript: Transcript | null;
}) {
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
		}
	};

	return (
		<>
			<Head>
				<title>{props.video.title}</title>
			</Head>
			<div className="container mx-auto p-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Left Column: Video and Feedback List */}
					<div className="flex flex-col space-y-6">
						{/* Video Player */}
						<video
							ref={videoRef}
							controls
							className="w-full rounded-lg border border-gray-300 shadow-sm"
							onTimeUpdate={handleTimeUpdate}
						>
							<source
								src={props.video.videoUrl}
								type="video/mp4"
							/>
							Your browser does not support the video tag.
						</video>
						<EventsTimeline
							events={props.events}
							onEventClick={handleTimestampClick}
							videoDuration={props.video.videoDuration}
						/>
						{/* Feedback List */}
						<VideoFeedbackSection
							video={props.video}
							onTimestampClick={handleTimestampClick}
						/>
					</div>

					{/* Right Column: Description, Transcription, Events */}
					<div>
						<Tabs
							onChange={(_, val) => setValue(val)}
							value={value}
						>
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
						</Tabs>
						<div className="overflow-y-auto max-h-[100vh] dark:bg-slate-800 rounded-lg p-4">
							{value === 0 && (
								<VideoDetails video={props.video} />
							)}
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
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
	const dataDirectory = path.join(process.cwd(), 'data');
  	const filePath = path.join(dataDirectory, 'videos.json');
  	const fileContents = fs.readFileSync(filePath, 'utf-8');
  	const videos: Video[] = JSON.parse(fileContents);

	const paths = videos.map(video => ({
		params: { videoId: video.id.toString() },
	}));

	return { paths, fallback: false };
}

export async function getStaticProps(context: GetStaticPropsContext) {
	const { videoId } = context.params!;

	const dataDirectory = path.join(process.cwd(), 'data');
  	const videosFilePath = path.join(dataDirectory, 'videos.json');
  	const videoFileContents = fs.readFileSync(videosFilePath, 'utf-8');
  	const videos: Video[] = JSON.parse(videoFileContents);
	const video = videos.find(v => v.id === videoId);

	const eventsFilePath = path.join(dataDirectory, 'events.json');
  	const eventsFileContent = fs.readFileSync(eventsFilePath, 'utf-8');
	const allEvents: Event[] = JSON.parse(eventsFileContent);
	const events = allEvents.find(event => event.RecordingID === videoId);

	const transcriptsFilePaths = path.join(dataDirectory, 'transcripts.json');
  	const transcriptsContent = fs.readFileSync(transcriptsFilePaths, 'utf-8');
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
