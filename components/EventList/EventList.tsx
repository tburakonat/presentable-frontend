import { Event } from "@/types";
import React from "react";

interface EventProps {
	event: Event | null;
	onEventClick: (time: number) => void;
}

const EventList = (props: EventProps) => {
	const convertTimeToSeconds = (time: string) => {
		const [hours, minutes, seconds] = time.split(":").map(Number);
		const [sec, millisec] = seconds.toString().split(".").map(Number);
		return hours * 3600 + minutes * 60 + sec + (millisec || 0) / 1000;
	};

	if (!props.event) {
		return <div>No events found</div>;
	}

	const handleClick = (startInterval: string) => {
		const time = convertTimeToSeconds(startInterval);
		props.onEventClick(time);
	};

	return (
		<div className="space-y-4 ">
			{props.event.Intervals.map((interval, intervalIndex) => {
				if (!interval.annotations.feedbackFired) {
					return null;
				}
				
				return (
					<div
						key={interval.start}
						className="p-4 mb-4 border border-gray-200 rounded-md cursor-pointer dark:bg-slate-800"
						onClick={() => handleClick(interval.start)}
					>
						<p className="text-sm">
							<strong>Start:</strong> {interval.start}{" "}
							<strong>End:</strong> {interval.end}
						</p>
						<p className="mt-2">
							{interval.annotations.feedbackMessage}
						</p>
					</div>
				);
			})}
		</div>
	);
};

export default EventList;
