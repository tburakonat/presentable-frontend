import { Video } from "@/types";
import Link from "next/link";

interface IVideoFeedbackSection {
	video: Video;
	onTimestampClick: (time: number) => void;
}

export default function VideoFeedbackSection(props: IVideoFeedbackSection) {
	return (
		<div className="mt-8 p-6 rounded-lg shadow-md dark:bg-slate-800">
			<h2 className="text-xl font-bold mb-4">Feedback</h2>

			<div className="mb-4">
				<Link
					href={`/videos/${props.video.id}/feedback/new`}
					className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
				>
					Create Feedback
				</Link>
			</div>

			{props.video.feedback.length > 0 ? (
				<div className="space-y-4">
					{props.video.feedback.map(fb => (
						<div
							key={fb.id}
							className="p-4 rounded-lg shadow-md border-l-4 border-blue-500 dark:bg-slate-900"
						>
							<Link
								href={`/videos/${props.video.id}/feedback/${fb.id}`}
								className="text-blue-500 hover:underline"
							>
								View Feedback
							</Link>
							<p className="text-sm text-gray-500">
								By {fb.createdBy} on{" "}
								{new Date(fb.createdAt).toLocaleDateString("de-DE")}
							</p>
						</div>
					))}
				</div>
			) : (
				<p>
					No feedback available for this video.
				</p>
			)}
		</div>
	);
}
