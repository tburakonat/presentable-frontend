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
			if (!props.feedbackFired) {
				return null;
			}

			switch (props.expertValidation) {
				case ExpertValidation.NOT_VALIDATED:
					return (
						<Tooltip title="Click to validate. Click to toggle validation status.">
							<button onClick={props.onChangeValidation}>
								<Badge color="blue">To Review</Badge>
							</button>
						</Tooltip>
					);
				case ExpertValidation.VALIDATED:
					return (
						<Tooltip title="Click to invalidate. Invalidated events will not be displayed to students.">
							<button onClick={props.onChangeValidation}>
								<Badge color="green">Validated</Badge>
							</button>
						</Tooltip>
					);

				case ExpertValidation.INVALIDATED:
					return (
						<Tooltip title="Click to validate. Validated events will be displayed to students.">
							<button onClick={props.onChangeValidation}>
								<Badge color="red">Invalidated</Badge>
							</button>
						</Tooltip>
					);

				default:
					return null;
			}

		case "STUDENT":
		case "ADMIN":
			if (!props.feedbackFired) {
				return null;
			}

			switch (props.expertValidation) {
				case ExpertValidation.NOT_VALIDATED:
					return (
						<Tooltip title="This AI-generated feedback is not yet reviewed by an expert.">
							<button>
								<Badge color="blue">In Review</Badge>
							</button>
						</Tooltip>
					);
				case ExpertValidation.VALIDATED:
					return (
						<Tooltip title="This AI-generated feedback was validated by an expert.">
							<button>
								<Badge color="green">Valid</Badge>
							</button>
						</Tooltip>
					);

				case ExpertValidation.INVALIDATED:
					return (
						<Tooltip title="You can ignore this comment.It was invalidated by an expert.">
							<button>
								<Badge color="red">Invalid</Badge>
							</button>
						</Tooltip>
					);

				default:
					return null;
			}
	}

	return null;
};

export default EventValidationBadge;
