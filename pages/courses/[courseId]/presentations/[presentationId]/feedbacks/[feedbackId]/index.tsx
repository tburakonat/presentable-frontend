import { useRouter } from "next/router";
import { useState } from "react";
import { Tab, Tabs } from "@mui/material";

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

function PresentationFeedbackDetailsPage() {
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
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4">
				{/* Video Section */}
				<section className="col-span-2 xl:col-span-1 flex flex-col gap-4 p-4">
					<video
						ref={videoRef}
						controls
						className="w-full rounded-md border border-gray-300 shadow-sm"
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
				</section>

				{/* Description Section */}
				<section className="p-4">
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

					<div className="px-4 py-8 max-h-80 overflow-y-auto">
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
					</div>
				</section>

				{/* Feedback Section */}
				<section className="col-span-2 border rounded-md p-4 mt-4">
					<FeedbackContent
						feedback={feedback.content}
						onTimestampClick={handleTimestampClick}
					/>
					<p className="text-sm text-gray-500">
						By {feedback.created_by.first_name}{" "}
						{feedback.created_by.last_name} on{" "}
						{new Date(feedback.created_at).toLocaleDateString(
							"de-DE"
						)}
					</p>
				</section>

				{/* Comments Section */}
				<section className="col-span-2 border rounded-md p-4 mt-4">
					<CommentSection
						feedback={feedback}
						comments={comments}
						onTimestampClick={handleTimestampClick}
					/>
				</section>
			</div>
		</div>
	);
}

export default withAuth(PresentationFeedbackDetailsPage);
