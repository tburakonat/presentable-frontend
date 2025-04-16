import Head from "next/head";
import { useRouter } from "next/router";
import { Tab, Tabs } from "@mui/material";
import { useState } from "react";

import { VideoTab } from "@/types";
import { useVideoTimestamp } from "@/hooks";
import { usePresentationDetailsQuery } from "@/helpers/queries";
import {
	PresentationFeedbackSection,
	PresentationDetails,
	EventList,
	TranscriptList,
	EventsTimeline,
	withAuth,
	ErrorMessage,
	Loading,
	Breadcrumbs,
} from "@/components";
import { AxiosError } from "axios";
import { useSession } from "@/context";

interface PresentationDetailsPageProps {}

function PresentationDetailsPage(props: PresentationDetailsPageProps) {
	const { user } = useSession();
	const router = useRouter();
	const videoRef = useVideoTimestamp();
	const [videoTime, setVideoTime] = useState(0);
	const [value, setValue] = useState(VideoTab.Description);
	const [presentationQuery, feedbacksQuery] = usePresentationDetailsQuery(
		router.query.presentationId as string
	);

	if (presentationQuery.isLoading || feedbacksQuery.isLoading) {
		return <Loading />;
	}

	if (presentationQuery.error || feedbacksQuery.error) {
		const { response } = presentationQuery.error as AxiosError;
		const { detail, status, statusText } = response?.data as any;
		return (
			<ErrorMessage
				detail={detail}
				status={status}
				statusText={statusText}
			/>
		);
	}

	const presentation = presentationQuery.data?.data;
	const feedbacks = feedbacksQuery.data?.data ?? [];
	const myFeedbacks = feedbacks.filter(
		fb => fb.created_by.username === user?.username
	);

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
	];

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
				<title>{presentation.title}</title>
			</Head>
			<div className="p-6">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
					{/* Left Column: Video and Feedback List */}
					<div className="flex flex-col space-y-6">
						<video
							ref={videoRef}
							controls
							className="w-full rounded-lg border border-gray-300 shadow-sm"
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
						<PresentationFeedbackSection
							presentation={presentation}
							feedbacks={myFeedbacks}
							onTimestampClick={handleTimestampClick}
						/>
					</div>

					{/* Right Column: Description, Transcription, Events */}
					<div>
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
						<div className="overflow-y-auto max-h-[100vh] rounded-lg rounded-t-none p-4">
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
					</div>
				</div>
			</div>
		</>
	);
}

export default withAuth(PresentationDetailsPage);
