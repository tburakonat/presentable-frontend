import { useSession } from "@/context";
import { useDeleteFeedbackMutation } from "@/helpers/mutations";
import { Feedback, Presentation } from "@/types";
import Link from "next/link";

interface IPresentationFeedbackSection {
	presentation: Presentation;
	feedbacks: Feedback[];
	onTimestampClick: (time: number) => void;
}

function PresentationFeedbackSection(props: IPresentationFeedbackSection) {
	const { user } = useSession();

	const { mutate } = useDeleteFeedbackMutation();

	const handleDeleteFeedback = async (feedbackId: number) => {
		try {
			mutate(feedbackId);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="mt-8 p-6 rounded-lg shadow-md dark:bg-slate-800">
			<h2 className="text-xl font-bold mb-4">Feedback</h2>

			{user?.role === "TEACHER" && (
				<div className="mb-4">
					<Link
						href={`/courses/${props.presentation.course.id}/presentations/${props.presentation.id}/feedbacks/new`}
						className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
					>
						Create Feedback
					</Link>
				</div>
			)}

			{props.feedbacks.length > 0 ? (
				<div className="space-y-4">
					{props.feedbacks.map(fb => (
						<div
							key={fb.id}
							className="p-4 rounded-lg shadow-md border-l-4 border-blue-500 dark:bg-slate-900"
						>
							<div className="flex justify-between items-center">
								<Link
									href={`/courses/${props.presentation.course.id}/presentations/${props.presentation.id}/feedbacks/${fb.id}`}
									className="text-blue-500 hover:underline"
								>
									View Feedback
								</Link>
								{user!.id === fb.created_by.id && (
									<span
										className="cursor-pointer"
										onClick={() =>
											handleDeleteFeedback(fb.id)
										}
									>
										<i className="ri-delete-bin-line"></i>
									</span>
								)}
							</div>
							<p className="text-sm text-gray-500">
								By {fb.created_by.first_name}{" "}
								{fb.created_by.last_name} on{" "}
								{new Date(fb.created_at).toLocaleDateString(
									"de-DE"
								)}
							</p>
						</div>
					))}
				</div>
			) : (
				<p>No feedback available for this presentation.</p>
			)}
		</div>
	);
}

export default PresentationFeedbackSection;
