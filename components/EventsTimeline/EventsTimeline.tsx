import { Event } from "@/types";
import { Tooltip } from "../Tooltip";
import { convertTimestampToSeconds } from "@/helpers/helpers";

interface IEventsTimelineProps {
	events: Event | null;
	onEventClick: (time: number) => void;
	videoDuration: string;
}

const EventsTimeline = (props: IEventsTimelineProps) => {
	const handleEventClick = (startInterval: string) => {
		const time = convertTimestampToSeconds(startInterval);
		props.onEventClick(time);
	};

	if (!props.events) {
		return null;
	}

	if (!props.videoDuration) {
		return <p>Start video to load events</p>;
	}

	if (
		props.events.Intervals.every(
			interval => !interval.annotations.feedbackFired
		)
	) {
		return null;
	}
	return (
		<div className="w-full">
			<div className="relative border-t-2 border-gray-500">
				{props.events.Intervals.map(interval => {
					if (
						!props.videoDuration ||
						!interval.annotations.feedbackFired
					) {
						return null;
					}
					const start = convertTimestampToSeconds(interval.start);
					const position =
						(start / convertTimestampToSeconds(props.videoDuration)) *
						100;
					return (
						<Tooltip
							key={interval.start}
							tooltipComponent={
								interval.annotations.feedbackMessage
							}
							style={{
								left: `${position}%`,
							}}
						>
							<div
								onClick={() => handleEventClick(interval.start)}
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
