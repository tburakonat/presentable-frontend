import { Event, ExpertValidation } from "@/types";
import { convertTimestampToSeconds } from "@/helpers/helpers";
import { Tooltip } from "@mui/material";

interface IEventsTimelineProps {
	events: Event | null;
	onEventClick: (time: number) => void;
	videoDuration: string;
}

const EventsTimeline = (props: IEventsTimelineProps) => {
	// The EventsTimeline only shows AI-generated events that have been validated by an expert.
	const aiGeneratedEvents = props.events?.Intervals.filter(
		interval => interval.annotations.feedbackFired
	);
	const handleEventClick = (startInterval: string) => {
		const time = convertTimestampToSeconds(startInterval);
		props.onEventClick(time);
	};

	if (!aiGeneratedEvents || aiGeneratedEvents.length === 0) {
		return null;
	}

	if (!props.videoDuration) {
		return <p>Start video to load events</p>;
	}

	if (
		aiGeneratedEvents.every(
			interval =>
				interval.annotations.expertValidation ===
				ExpertValidation.INVALIDATED
		)
	) {
		return null;
	}
	return (
		<div className="w-full">
			<div className="relative border-t-2 border-gray-500">
				{aiGeneratedEvents.map(event => {
					if (
						!props.videoDuration ||
						!event.annotations.feedbackFired
					) {
						return null;
					}
					const start = convertTimestampToSeconds(event.start);
					const position =
						(start /
							convertTimestampToSeconds(props.videoDuration)) *
						100;
					return (
						<Tooltip
							key={event.start}
							title={event.annotations.feedbackMessage}
							style={{
								left: `${position}%`,
							}}
						>
							<div
								onClick={() => handleEventClick(event.start)}
								className="absolute w-3 h-3 bg-white rounded-full border-2 border-black cursor-pointer translate-x--1/2 -translate-y-1/2"
							/>
						</Tooltip>
					);
				})}
			</div>
			<div className="flex justify-between mt-2">
				<span>Start</span>
				<span>End</span>
			</div>
		</div>
	);
};

export default EventsTimeline;
