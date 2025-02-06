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
	Loading,
	ErrorMessage,
	Breadcrumbs,
} from "@/components";
import { useVideoTimestamp } from "@/hooks";
import { useFeedbackDetailsQuery } from "@/helpers/queries";
import { VideoTab } from "@/types";
import Head from "next/head";
import { AxiosError } from "axios";

function PresentationFeedbackDetailsPage() {
	const router = useRouter();
	const videoRef = useVideoTimestamp();
	const [videoTime, setVideoTime] = useState(0);
	const [value, setValue] = useState(VideoTab.Description);
	const [feedbackQuery, commentsQuery] = useFeedbackDetailsQuery(
		router.query.feedbackId as string
	);

	if (feedbackQuery.isLoading || commentsQuery.isLoading) {
		return <Loading />;
	}

	if (feedbackQuery.error || commentsQuery.error) {
		const { response } = feedbackQuery.error as AxiosError;
		const { detail, status, statusText } = response?.data as any;
		return (
			<ErrorMessage
				detail={detail}
				status={status}
				statusText={statusText}
			/>
		);
	}

	const feedback = feedbackQuery.data?.data;
	const presentation = feedback?.presentation;
	const comments = commentsQuery.data?.data ?? [];

	if (!presentation) {
		return <p>Presentation not found</p>;
	}

	const breadcrumbs = [
		{ title: "Dashboard", link: "/dashboard" },
		{ title: "Courses", link: "/courses" },
		{
			title: presentation.course.name,
			link: `/courses/${presentation.course.id}`,
		},
		{
			title: presentation.title,
			link: `/courses/${presentation.course.id}/presentations/${presentation.id}`,
		},
		{
			title: "Feedback",
			link: `/courses/${presentation.course.id}/presentations/${presentation.id}/feedbacks/${feedback.id}`,
		},
	];

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
		<>
			<Head>
				<title>{presentation.title} - Feedback</title>
			</Head>
			<div className="p-6">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
					{/* Video Section */}
					<section className="col-span-2 xl:col-span-1 flex flex-col gap-4 p-4">
						<video
							ref={videoRef}
							controls
							className="w-full rounded-md border border-gray-300 shadow-sm"
							onTimeUpdate={handleTimeUpdate}
						>
							<source
								src={presentation.video_url}
								type="video/mp4"
							/>
							Your browser does not support the video tag.
						</video>
						<EventsTimeline
							events={presentation.presentation_events}
							onEventClick={handleTimestampClick}
							videoDuration={presentation.video_duration}
						/>
					</section>

					{/* Description Section */}
					<section>
						<div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
							<ul className="flex flex-wrap -mb-px">
								<li className="me-2">
									<button
										className={`inline-block p-4 rounded-t-lg ${
											value === VideoTab.Description
												? "border-b-2 text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-50"
												: "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
										}`}
										aria-current="page"
										onClick={() =>
											setValue(VideoTab.Description)
										}
									>
										Description
									</button>
								</li>
								<li className="me-2">
									<button
										className={`inline-block p-4 rounded-t-lg  ${
											value === VideoTab.Events
												? "border-b-2 text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-50"
												: "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
										}`}
										onClick={() =>
											setValue(VideoTab.Events)
										}
									>
										Events
									</button>
								</li>
								<li className="me-2">
									<button
										className={`inline-block p-4 rounded-t-lg  ${
											value === VideoTab.Transcription
												? "border-b-2 text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-50"
												: "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
										}`}
										onClick={() =>
											setValue(VideoTab.Transcription)
										}
									>
										Transcription
									</button>
								</li>
							</ul>
						</div>
						<div className="px-4 py-8 max-h-[23rem] overflow-y-auto">
							{value === VideoTab.Description && (
								<PresentationDetails
									presentation={presentation}
								/>
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
		</>
	);
}

export default withAuth(PresentationFeedbackDetailsPage);
