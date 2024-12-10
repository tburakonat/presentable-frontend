import { Editor, EventList, EventsTimeline, TranscriptList, VideoDetails } from "@/components";
import { useVideoTimestamp } from "@/hooks";
import { Event, Transcript, Video } from "@/types";
import { Tabs, Tab, Box } from "@mui/material";
import { GetStaticPathsResult, GetStaticPropsContext } from "next";
import { useState } from "react";

export default function CreateVideoFeedbackPage(props: {
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
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
					<Tabs onChange={(_, val) => setValue(val)}>
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
					</Box>
				</div>
			</div>

			<div className="space-y-4"></div>
		</div>
	);
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
	const res = await fetch("http://localhost:8080/videos");
	const data: Video[] = await res.json();

	const paths = data.map(video => ({
		params: { videoId: video.id.toString() },
	}));

	return { paths, fallback: false };
}

export async function getStaticProps(context: GetStaticPropsContext) {
	const { videoId } = context.params!;

	const res = await fetch("http://localhost:8080/videos");
	const data: Video[] = await res.json();
	const video = data.find(v => v.id === videoId);

	const res2 = await fetch("http://localhost:8080/events");
	const data2: Event[] = await res2.json();
	const events = data2.find(event => event.RecordingID === videoId);

	const res3 = await fetch("http://localhost:8080/transcripts");
	const data3: Transcript[] = await res3.json();
	const transcript = data3.find(event => event.RecordingID === videoId);

	return {
		props: {
			video,
			events: events || null,
			transcript: transcript || null,
		},
	};
}
