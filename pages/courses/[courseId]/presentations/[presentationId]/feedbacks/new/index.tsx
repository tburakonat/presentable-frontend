import {
	Editor,
	EventList,
	EventsTimeline,
	TranscriptList,
	PresentationDetails,
} from "@/components";
import { useVideoTimestamp } from "@/hooks";
import { Presentation, VideoTab } from "@/types";
import { Tabs, Tab, Box } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import Link from "next/link";
import { dataService } from "@/services";


interface CreateFeedbackPageProps {
	presentation: Presentation;
}

export default function CreateFeedbackPage(props: CreateFeedbackPageProps) {
	const videoRef = useVideoTimestamp();
	const [value, setValue] = useState(VideoTab.Description);

	useEffect(() => {
		if (typeof window !== "undefined") {
		  const hash = window.location.hash as VideoTab;
		  setValue(hash || VideoTab.Description);
		}
	}, []);


	const [videoTime, setVideoTime] = useState(0);

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
					<Box p={2} className="overflow-y-auto max-h-[100vh]">
						{value === VideoTab.Description && (
							<PresentationDetails presentation={props.presentation} />
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
					</Box>
				</div>
			</div>

			<div className="space-y-4"></div>
		</div>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { access_token } = context.req.cookies;
	const { courseId, presentationId } = context.params!;

	if (!access_token) {
		return {
			redirect: {
				destination: `/login?next=/courses/${courseId}/presentations/${presentationId}/feedbacks/new`,
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
				destination: `/login?next=/courses/${courseId}/presentations/${presentationId}/feedbacks/new`,
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

	return {
		props: {
			presentation,
		},
	};
}
