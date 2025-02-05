import { PropsWithChildren } from "react";
import { Tooltip } from "@mui/material";

import { Badge } from "@/components";
import { useSession } from "@/context";
import { ExpertValidation } from "@/types";

interface EventValidationBadgeProps extends PropsWithChildren {
	expertValidation: ExpertValidation;
	feedbackFired: boolean;
	onChangeValidation: () => void;
}

const EventValidationBadge = (props: EventValidationBadgeProps) => {
	const { user } = useSession();

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
							<button onClick={props.onChangeValidation}>
								<span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/10">
									<i className="ri-search-eye-line"></i>
								</span>
							</button>
						</Tooltip>
					);
				case ExpertValidation.VALIDATED:
					return (
						<Tooltip title="Click to invalidate. Invalidated events will not be displayed to students.">
							<button onClick={props.onChangeValidation}>
								<span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">
									<i className="ri-check-line"></i>
								</span>
							</button>
						</Tooltip>
					);

				case ExpertValidation.INVALIDATED:
					return (
						<Tooltip title="Click to validate. Validated events will be displayed to students.">
							<button onClick={props.onChangeValidation}>
								<span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
									<i className="ri-flag-fill"></i>
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
						<Tooltip title="This AI-generated feedback was validated by an expert.">
							<span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">
								<i className="ri-check-line"></i>
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
