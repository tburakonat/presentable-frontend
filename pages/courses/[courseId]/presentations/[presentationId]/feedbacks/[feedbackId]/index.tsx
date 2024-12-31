import {
	CommentSection,
	EventList,
	EventsTimeline,
	FeedbackContent,
	TranscriptList,
	PresentationDetails,
} from "@/components";
import { useVideoTimestamp } from "@/hooks";
import { Comment, Feedback, Presentation, VideoTab } from "@/types";
import { Box, Tab, Tabs } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";

import Link from "next/link";
import { dataService } from "@/services";

interface PresentationFeedbackDetailsPageProps {
	presentation: Presentation;
	feedback: Feedback;
	comments: Comment[];
}

function PresentationFeedbackDetailsPage(
	props: PresentationFeedbackDetailsPageProps
) {
	const videoRef = useVideoTimestamp();
	const [videoTime, setVideoTime] = useState(0);
	const [value, setValue] = useState(VideoTab.Description);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const hash = window.location.hash as VideoTab;
			setValue(hash || VideoTab.Description);
		}
	}, []);

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
						<source
							src={props.presentation.video_url}
							type="video/mp4"
						/>
						Your browser does not support the video tag.
					</video>
					<EventsTimeline
						events={props.presentation.presentation_events}
						onEventClick={handleTimestampClick}
						videoDuration={props.presentation.video_duration}
					/>
					<div className="mt-8 p-6 rounded-lg shadow-md dark:bg-slate-800">
						<h2 className="text-xl font-bold mb-4">Feedback</h2>
						<FeedbackContent
							feedback={props.feedback.content}
							onTimestampClick={handleTimestampClick}
						/>
						<p className="text-sm text-gray-500">
							By {props.feedback.created_by.first_name}{" "}
							{props.feedback.created_by.last_name} on{" "}
							{new Date(
								props.feedback.created_at
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
							<PresentationDetails
								presentation={props.presentation}
							/>
						)}
						{value === VideoTab.Events && (
							<EventList
								event={props.presentation.presentation_events}
								onEventClick={handleTimestampClick}
							/>
						)}
						{value === VideoTab.Transcription && (
							<TranscriptList
								transcript={props.presentation.transcription}
								onTranscriptClick={handleTimestampClick}
								videoTime={videoTime}
							/>
						)}
						{value === VideoTab.Comments && (
							<CommentSection
								comments={props.comments}
								onTimestampClick={handleTimestampClick}
							/>
						)}
					</Box>
				</div>
			</div>
		</div>
	);
}

export default PresentationFeedbackDetailsPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { access_token } = context.req.cookies;
	const { presentationId, feedbackId } = context.params!;

	if (!access_token) {
		return {
			redirect: {
				destination: `/login?next=/presentations/${presentationId}/feedbacks/${feedbackId}`,
				permanent: false,
			},
		};
	}

	const response = await dataService.getFeedbackById(
		access_token,
		feedbackId as string
	);

	if (!response.ok && response.status === 401) {
		return {
			redirect: {
				destination: `/login?next=/presentations/${presentationId}/feedbacks/${feedbackId}`,
				permanent: false,
			},
		};
	}

	if (!response.ok && response.status === 404) {
		return {
			notFound: true,
		};
	}

	const feedback = await response.json();

	const commentsResponse = await dataService.getCommentsByFeedbackId(
		access_token,
		feedbackId as string
	);

	if (!commentsResponse.ok && commentsResponse.status === 401) {
		return {
			redirect: {
				destination: `/login?next=/presentations/${presentationId}/feedbacks/${feedbackId}`,
				permanent: false,
			},
		};
	}

	const comments = await commentsResponse.json();

	return {
		props: {
			feedback,
			presentation: feedback.presentation,
			comments,
		},
	};
}
