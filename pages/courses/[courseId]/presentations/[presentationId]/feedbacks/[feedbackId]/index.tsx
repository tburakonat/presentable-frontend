import { useRouter } from "next/router";
import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";

import {
	CommentSection,
	EventList,
	EventsTimeline,
	FeedbackContent,
	TranscriptList,
	PresentationDetails,
	withAuth,
} from "@/components";
import { useVideoTimestamp } from "@/hooks";
import { useFeedbackDetailsQuery } from "@/helpers/queries";
import { VideoTab } from "@/types";

interface PresentationFeedbackDetailsPageProps {}

function PresentationFeedbackDetailsPage(
	props: PresentationFeedbackDetailsPageProps
) {
	const router = useRouter();
	const videoRef = useVideoTimestamp();
	const [videoTime, setVideoTime] = useState(0);
	const [value, setValue] = useState(VideoTab.Description);
	const [feedbackQuery, commentsQuery] = useFeedbackDetailsQuery(
		router.query.feedbackId as string
	);

	if (feedbackQuery.isLoading || commentsQuery.isLoading) {
		return <p>Loading...</p>;
	}

	if (feedbackQuery.error || commentsQuery.error) {
		return <p>{feedbackQuery.error?.message}</p>;
	}

	const feedback = feedbackQuery.data?.data;
	const presentation = feedback?.presentation;
	const comments = commentsQuery.data?.data ?? [];

	if (!presentation) {
		return <p>Presentation not found</p>;
	}

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
						<source src={presentation.video_url} type="video/mp4" />
						Your browser does not support the video tag.
					</video>
					<EventsTimeline
						events={presentation.presentation_events}
						onEventClick={handleTimestampClick}
						videoDuration={presentation.video_duration}
					/>

					{feedback && (
						<div className="mt-8 p-6 rounded-lg shadow-md dark:bg-slate-800">
							<h2 className="text-xl font-bold mb-4">Feedback</h2>
							<FeedbackContent
								feedback={feedback.content}
								onTimestampClick={handleTimestampClick}
							/>
							<p className="text-sm text-gray-500">
								By {feedback.created_by.first_name}{" "}
								{feedback.created_by.last_name} on{" "}
								{new Date(
									feedback.created_at
								).toLocaleDateString("de-DE")}
							</p>
						</div>
					)}
				</div>

				{/* Right Column: Description, Transcription, Events, Comments */}
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
						<Tab
							label="Comments"
							className="dark:text-white"
							value={VideoTab.Comments}
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
						{value === VideoTab.Comments && (
							<CommentSection
								comments={comments}
								onTimestampClick={handleTimestampClick}
							/>
						)}
					</Box>
				</div>
			</div>
		</div>
	);
}

export default withAuth(PresentationFeedbackDetailsPage);
