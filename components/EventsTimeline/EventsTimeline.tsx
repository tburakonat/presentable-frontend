import { Event } from "@/types";
import { Tooltip } from "../Tooltip";

interface IEventsTimelineProps {
	events: Event | null;
	onEventClick: (time: number) => void;
	videoDuration: string;
}

const EventsTimeline = (props: IEventsTimelineProps) => {
	const convertTimeToSeconds = (time: string) => {
		const [hours, minutes, seconds] = time.split(":").map(Number);
		const [sec, millisec] = seconds.toString().split(".").map(Number);
		return hours * 3600 + minutes * 60 + sec + (millisec || 0) / 1000;
	};

	const handleEventClick = (startInterval: string) => {
		const time = convertTimeToSeconds(startInterval);
		props.onEventClick(time);
	};

	if (!props.events) {
		return null;
	}

	if (!props.videoDuration) {
		return <p>Start video to load events</p>;
	}

	return (
		<div className="w-full">
			<div className="flex justify-between items-center relative border-t-2 border-gray-500">
				{props.events.Intervals.map(interval => {
					if (
						!props.videoDuration ||
						!interval.annotations.feedbackFired
					) {
						return null;
					}
					const start = convertTimeToSeconds(interval.start);
					const position =
						(start / convertTimeToSeconds(props.videoDuration)) *
						100;
					return (
						<Tooltip
							key={interval.start}
							tooltipComponent={
								interval.annotations.feedbackMessage
							}
						>
							<div
								onClick={() => handleEventClick(interval.start)}
								className="absolute w-3 h-3 bg-white rounded-full border-2 border-black cursor-pointer"
								style={{
									left: `${position}%`,
									transform: "translate(-50%, -50%)",
								}}
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
