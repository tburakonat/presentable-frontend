import {
	CommentSection,
	EventList,
	EventsTimeline,
	FeedbackContent,
	TranscriptList,
	VideoDetails,
} from "@/components";
import { useVideoTimestamp } from "@/hooks";
import { Comment, Event, Feedback, Transcript, Video, VideoTab } from "@/types";
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
	comments: Comment[] | null;
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
						<source src={props.video.video_url} type="video/mp4" />
						Your browser does not support the video tag.
					</video>
					<EventsTimeline
						events={props.events}
						onEventClick={handleTimestampClick}
						videoDuration={props.video.video_duration}
					/>
					<div className="mt-8 p-6 rounded-lg shadow-md dark:bg-slate-800">
						<h2 className="text-xl font-bold mb-4">Feedback</h2>
						<FeedbackContent
							feedback={props.feedback.content}
							onTimestampClick={handleTimestampClick}
						/>
						<p className="text-sm text-gray-500">
							By {props.feedback.teacher.user.first_name}{" "}
							{props.feedback.teacher.user.last_name} on{" "}
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

export const getStaticPaths = async () => {
	const res = await fetch("http://127.0.0.1:8000/api/feedbacks/");
	const feedbacks: Feedback[] = await res.json();

	const paths = feedbacks.map(feedback => {
		return {
			params: {
				videoId: feedback.presentation.id.toString(),
				feedbackId: feedback.id.toString(),
			},
		};
	});

	return { paths, fallback: false };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
	const { feedbackId } = context.params!;

	const res = await fetch("http://127.0.0.1:8000/api/feedbacks/");
	const feedbacks: Feedback[] = await res.json();
	const feedback = feedbacks.find(
		feedback => feedback.id.toString() === feedbackId
	);

	if (!feedback) {
		return {
			notFound: true,
		};
	}

	const res2 = await fetch("http://127.0.0.1:8000/api/feedback-comments/");
	const allComments: Comment[] = await res2.json();
	const comments = allComments.filter(
		comment => comment.feedback.id === feedback.id
	);

	return {
		props: {
			video: feedback.presentation,
			feedback,
			events: feedback.presentation.presentation_events || null,
			transcript: feedback.presentation.transcription || null,
			comments: comments || null,
		},
	};
};
