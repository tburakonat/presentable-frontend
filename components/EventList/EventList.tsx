import { useRouter } from "next/router";

import { useSession } from "@/context";
import { EventValidationBadge } from "@/components";
import { useEditEventsMutation } from "@/helpers/mutations";
import { convertTimestampToSeconds } from "@/helpers/helpers";
import { Event, ExpertValidation } from "@/types";

interface EventProps {
	event: Event | null;
	onEventClick: (time: number) => void;
}

const EventList = (props: EventProps) => {
	const { user } = useSession();
	const router = useRouter();
	const { mutateAsync } = useEditEventsMutation(
		router.query.presentationId as string
	);

	if (!props.event) {
		return <div>No events found</div>;
	}

	const handleClick = (startInterval: string) => {
		const time = convertTimestampToSeconds(startInterval);
		props.onEventClick(time);
	};

	const handleChangeValidation = (eventId: number) => {
		const VALIDATION_OPTIONS = [
			ExpertValidation.VALIDATED,
			ExpertValidation.INVALIDATED,
		];

		const newIntervals = props.event!.Intervals.map(interval => {
			if (interval.id === eventId) {
				const newValidation = VALIDATION_OPTIONS.find(
					option => option !== interval.annotations.expertValidation
				);

				if (newValidation) {
					return {
						...interval,
						annotations: {
							...interval.annotations,
							expertValidation: newValidation,
						},
					};
				}
			}

			return interval;
		});

		const newEvent = {
			...props.event!,
			Intervals: newIntervals,
		};

		try {
			mutateAsync(newEvent);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="space-y-4">
			{props.event.Intervals.map(interval => {
				const { feedbackFired, expertValidation } =
					interval.annotations;

				if (!feedbackFired) {
					return null;
				}

				if (
					user?.role === "STUDENT" &&
					expertValidation === ExpertValidation.INVALIDATED
				) {
					return null;
				}

				return (
					<div
						key={interval.id}
						className="p-4 mb-4 border border-gray-200 rounded-md dark:bg-slate-800 cursor-pointer"
						onClick={() => handleClick(interval.start)}
					>
						<div className="flex justify-between items-center">
							<p className="text-sm">
								<strong>Start:</strong> {interval.start}{" "}
								<strong>End:</strong> {interval.end}
							</p>
							{interval.annotations.feedbackFired && (
								<div className="flex space-x-2">
									<EventValidationBadge
										expertValidation={expertValidation}
										feedbackFired={feedbackFired}
										onChangeValidation={() =>
											handleChangeValidation(interval.id)
										}
									/>
								</div>
							)}
						</div>
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
