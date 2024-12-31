import Head from "next/head";
import {
	PresentationFeedbackSection,
	PresentationDetails,
	EventList,
	TranscriptList,
	EventsTimeline,
} from "@/components";
import { Feedback, Presentation, VideoTab } from "@/types";
import { GetServerSidePropsContext } from "next";
import { useVideoTimestamp } from "@/hooks";
import { Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import Link from "next/link";
import { dataService } from "@/services";

interface PresentationDetailsPageProps {
	presentation: Presentation;
	feedbacks: Feedback[];
}

function PresentationDetailsPage(props: PresentationDetailsPageProps) {
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
		}
	};

	return (
		<>
			<Head>
				<title>{props.presentation.title}</title>
			</Head>
			<div className="container mx-auto p-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Left Column: Video and Feedback List */}
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
						<PresentationFeedbackSection
							presentation={props.presentation}
							feedbacks={props.feedbacks}
							onTimestampClick={handleTimestampClick}
						/>
					</div>

					{/* Right Column: Description, Transcription, Events */}
					<div>
						<Tabs
							onChange={(_, val) => setValue(val)}
							value={value}
						>
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
						</Tabs>
						<div className="overflow-y-auto max-h-[100vh] dark:bg-slate-800 rounded-lg p-4">
							{value === VideoTab.Description && (
								<PresentationDetails
									presentation={props.presentation}
								/>
							)}
							{value === VideoTab.Events && (
								<EventList
									event={
										props.presentation.presentation_events
									}
									onEventClick={handleTimestampClick}
								/>
							)}
							{value === VideoTab.Transcription && (
								<TranscriptList
									transcript={
										props.presentation.transcription
									}
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

export default PresentationDetailsPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { access_token } = context.req.cookies;
	const { courseId, presentationId } = context.params!;

	if (!access_token) {
		return {
			redirect: {
				destination: `/login?next=/courses/${courseId}/presentations/${presentationId}`,
				permanent: false,
			},
		};
	}

	const response = await dataService.getPresentationById(
		access_token,
		presentationId as string
	);

	if (!response.ok && response.status === 401) {
		return {
			redirect: {
				destination: `/login?next=/courses/${courseId}/presentations/${presentationId}`,
				permanent: false,
			},
		};
	};

	if (!response.ok && response.status === 404) {
		return {
			notFound: true,
		};
	};

	const presentation: Presentation = await response.json();

	const feedbackResponse = await dataService.getFeedbacksByPresentationId(
		access_token,
		presentationId as string
	);

	if (!feedbackResponse.ok && feedbackResponse.status === 401) {
		return {
			redirect: {
				destination: `/login?next=/courses/${courseId}/presentations/${presentationId}`,
				permanent: false,
			},
		};
	};

	if (!feedbackResponse.ok && feedbackResponse.status === 404) {
		return {
			notFound: true,
		};
	};

	const feedbacks: Feedback[] = await feedbackResponse.json();
	
	return {
		props: {
			presentation,
			feedbacks,
		},
	};
}
