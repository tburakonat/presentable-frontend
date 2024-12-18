import {
	Editor,
	EventList,
	EventsTimeline,
	TranscriptList,
	VideoDetails,
} from "@/components";
import { useVideoTimestamp } from "@/hooks";
import { Event, Feedback, Transcript, Video, VideoTab } from "@/types";
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
						<source src={props.video.video_url} type="video/mp4" />
						Your browser does not support the video tag.
					</video>
					<EventsTimeline
						events={props.events}
						onEventClick={handleTimestampClick}
						videoDuration={props.video.video_duration}
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
	const res = await fetch("http://127.0.0.1:8000/api/presentations/");
	const videos: Video[] = await res.json();

	const paths = videos.map(video => ({
		params: { videoId: video.id.toString() },
	}));

	return { paths, fallback: false };
}

export async function getStaticProps(context: GetStaticPropsContext) {
	const { videoId } = context.params!;

	const res = await fetch("http://127.0.0.1:8000/api/presentations/");
	const videos: Video[] = await res.json();
	const video = videos.find(video => video.id.toString() === videoId);

	if (!video) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			video,
			events: video.presentation_events || null,
			transcript: video.transcription || null,
		},
	};
}
