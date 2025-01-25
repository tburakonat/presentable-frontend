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
	ErrorMessage,
	Loading,
	Breadcrumbs,
} from "@/components";
import { useVideoTimestamp } from "@/hooks";
import { VideoTab } from "@/types";
import { usePresentationQuery } from "@/helpers/queries";
import Head from "next/head";
import { AxiosError } from "axios";

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
		return <Loading />;
	}

	if (presentationQuery.error) {
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
			title: "New Feedback",
			link: `/courses/${presentation.course.id}/presentations/${presentation.id}/new`,
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
				<title>{presentation.title} - New Feedback</title>
			</Head>
			<div className="container mx-auto p-6">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
					{/* Left Column: Video and Feedback */}
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
						<Editor presentationId={presentation.id} />
					</div>

					{/* Right Column: Tabs for Description, Transcription, Events */}
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

export default withAuth(CreateFeedbackPage);
