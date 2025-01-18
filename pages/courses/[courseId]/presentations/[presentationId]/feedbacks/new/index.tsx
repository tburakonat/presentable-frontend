import { useRouter } from "next/router";
import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";

import {
	Editor,
	EventList,
	EventsTimeline,
	TranscriptList,
	PresentationDetails,
	withAuth,
} from "@/components";
import { useVideoTimestamp } from "@/hooks";
import { VideoTab } from "@/types";
import { usePresentationQuery } from "@/helpers/queries";

interface CreateFeedbackPageProps {}

function CreateFeedbackPage(props: CreateFeedbackPageProps) {
	const router = useRouter();
	const videoRef = useVideoTimestamp();
	const [value, setValue] = useState(VideoTab.Description);
	const [videoTime, setVideoTime] = useState(0);
	const presentationQuery = usePresentationQuery(
		router.query.presentationId as string
	);

	if (presentationQuery.isLoading) {
		return <p>Loading...</p>;
	}

	if (presentationQuery.error) {
		return <p>{presentationQuery.error?.message}</p>;
	}

	const presentation = presentationQuery.data?.data;

	if (!presentation) {
		return <p>Presentation not found</p>;
	}

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
						<source src={presentation.video_url} type="video/mp4" />
						Your browser does not support the video tag.
					</video>
					<EventsTimeline
						events={presentation.presentation_events}
						onEventClick={handleTimestampClick}
						videoDuration={presentation.video_duration}
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
						/>
						<Tab
							label="Events"
							className="dark:text-white"
							value={VideoTab.Events}
						/>
						<Tab
							label="Transcription"
							className="dark:text-white"
							value={VideoTab.Transcription}
						/>
					</Tabs>
					<Box p={2} className="overflow-y-auto max-h-[100vh]">
						{value === VideoTab.Description && (
							<PresentationDetails presentation={presentation} />
						)}
						{value === VideoTab.Events && (
							<EventList
								event={presentation.presentation_events}
								onEventClick={handleTimestampClick}
							/>
						)}
						{value === VideoTab.Transcription && (
							<TranscriptList
								transcript={presentation.transcription}
								onTranscriptClick={handleTimestampClick}
								videoTime={videoTime}
							/>
						)}
					</Box>
				</div>
			</div>
		</div>
	);
}

export default withAuth(CreateFeedbackPage);
