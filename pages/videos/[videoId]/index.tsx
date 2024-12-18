import Head from "next/head";
import {
	VideoFeedbackSection,
	VideoDetails,
	EventList,
	TranscriptList,
	EventsTimeline,
} from "@/components";
import { Event, Feedback, Transcript, Video, VideoTab } from "@/types";
import { GetStaticPathsResult, GetStaticPropsContext } from "next";
import { useVideoTimestamp } from "@/hooks";
import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Link from "next/link";

export default function VideoDetailsPage(props: {
	video: Video;
	feedbacks: Feedback[];
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
								src={props.video.video_url}
								type="video/mp4"
							/>
							Your browser does not support the video tag.
						</video>
						<EventsTimeline
							events={props.events}
							onEventClick={handleTimestampClick}
							videoDuration={props.video.video_duration}
						/>
						{/* Feedback List */}
						<VideoFeedbackSection
							video={props.video}
							feedbacks={props.feedbacks}
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
						<div className="overflow-y-auto max-h-[100vh] dark:bg-slate-800 rounded-lg p-4">
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
									transcript={props.video.transcription}
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
	
	const res2 = await fetch("http://127.0.0.1:8000/api/feedbacks/");
	const feedbacks: Feedback[] = await res2.json();

	return {
		props: {
			video,
			feedbacks,
			events: video?.presentation_events || null,
			transcript: video?.transcription || null,
		},
	};
}
