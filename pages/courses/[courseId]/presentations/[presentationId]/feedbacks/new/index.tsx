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
						<Tabs
							onChange={(_, val) => setValue(val)}
							value={value}
						>
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
						</Box>
					</div>
				</div>
			</div>
		</>
	);
}

export default withAuth(CreateFeedbackPage);
