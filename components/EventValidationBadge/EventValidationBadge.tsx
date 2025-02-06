import { PropsWithChildren } from "react";
import { Tooltip } from "@mui/material";

import { Badge } from "@/components";
import { useSession } from "@/context";
import { ExpertValidation } from "@/types";

interface EventValidationBadgeProps extends PropsWithChildren {
	expertValidation: ExpertValidation;
	eventId: number;
	feedbackFired: boolean;
	onChangeValidation: (eventId: number, validation: ExpertValidation) => void;
}

const EventValidationBadge = (props: EventValidationBadgeProps) => {
	const { user } = useSession();

	const handleClick = (newExpertValidation: ExpertValidation) => {
		props.onChangeValidation(props.eventId, newExpertValidation);
	};

	switch (user!.role) {
		case "TEACHER":
		case "ADMIN":
			if (!props.feedbackFired) {
				return null;
			}

			switch (props.expertValidation) {
				case ExpertValidation.NOT_VALIDATED:
					return (
						<Tooltip title="Click to validate. Click to toggle validation status.">
							<button
								onClick={() =>
									handleClick(ExpertValidation.VALIDATED)
								}
							>
								<span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/10">
									<i className="ri-search-eye-line"></i>
								</span>
							</button>
						</Tooltip>
					);
				case ExpertValidation.VALIDATED:
					return (
						<Tooltip title="Click to invalidate. Invalidated events will not be displayed to students.">
							<button
								onClick={() =>
									handleClick(ExpertValidation.INVALIDATED)
								}
							>
								<span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">
									<i className="ri-check-line"></i>
								</span>
							</button>
						</Tooltip>
					);

				case ExpertValidation.INVALIDATED:
					return (
						<Tooltip title="Click to validate. Validated events will be displayed to students.">
							<button
								onClick={() =>
									handleClick(ExpertValidation.VALIDATED)
								}
							>
								<span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
									<i className="ri-flag-fill"></i>
								</span>
							</button>
						</Tooltip>
					);

				case ExpertValidation.TO_REVIEW:
					return (
						<Tooltip title="Students wants validation. Click to validate. Click twice to invalidate">
							<button
								onClick={() =>
									handleClick(ExpertValidation.VALIDATED)
								}
							>
								<span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
									<i className="ri-question-mark"></i>
								</span>
							</button>
						</Tooltip>
					);

				default:
					return null;
			}

		case "STUDENT":
			if (!props.feedbackFired) {
				return null;
			}

			switch (props.expertValidation) {
				case ExpertValidation.NOT_VALIDATED:
					return (
						<Tooltip title="This AI-generated feedback is not yet reviewed by an expert.">
							<span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/10">
								<i className="ri-hourglass-fill"></i>
							</span>
						</Tooltip>
					);
				case ExpertValidation.VALIDATED:
					return (
						<Tooltip title="This AI-generated feedback was validated by an expert. Click to ask for review.">
							<button
								onClick={() =>
									handleClick(ExpertValidation.TO_REVIEW)
								}
							>
								<span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">
									<i className="ri-check-line"></i>
								</span>
							</button>
						</Tooltip>
					);

				case ExpertValidation.TO_REVIEW:
					return (
						<Tooltip title="You asked for validation of this event. Waiting for expert review.">
							<span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
								<i className="ri-question-mark"></i>
							</span>
						</Tooltip>
					);

				case ExpertValidation.INVALIDATED:
					// Invalidated events are not displayed to students
					return null;

				default:
					return null;
			}
	}

	return null;
};

export default EventValidationBadge;
