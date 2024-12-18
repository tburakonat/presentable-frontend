import Link from "next/link";
import { Video } from "@/types";

interface IVideoListProps {
	videos: Video[];
}

export default function VideoList({ videos }: IVideoListProps) {
	const handleMouseEnter = (videoElement: HTMLVideoElement) => {
		const duration = videoElement.duration;
		if (isNaN(duration) || duration <= 30) {
			videoElement.play();
			return;
		}

		// Play 10 seconds from the beginning, middle, and end sequentially
		let segmentIndex = 0;
		const segments = [0, duration / 2 - 5, duration - 10]; // Start, middle, end
		videoElement.currentTime = segments[segmentIndex];
		videoElement.play();

		const intervalId = setInterval(() => {
			segmentIndex++;
			if (segmentIndex < segments.length) {
				videoElement.currentTime = segments[segmentIndex];
			} else {
				clearInterval(intervalId);
				videoElement.pause();
			}
		}, 10000); // Switch segments every 10 seconds

		videoElement.dataset["intervalId"] = intervalId.toString();
	};

	const handleMouseLeave = (videoElement: HTMLVideoElement) => {
		videoElement.pause();

		// Clear any running interval
		const intervalId = videoElement.dataset["intervalId"];
		if (intervalId) {
			clearInterval(Number(intervalId));
			delete videoElement.dataset["intervalId"];
		}
	};

	return (
		<>
			{videos.map(video => (
				<div
					key={video.id}
					className="flex flex-col justify-between dark:bg-slate-800 rounded-lg p-4 shadow-xl"
				>
					<div className="mb-4">
						<video
							className="w-full rounded-lg"
							src={video.video_url}
							muted
							loop={false}
							onMouseEnter={e =>
								handleMouseEnter(e.currentTarget)
							}
							onMouseLeave={e =>
								handleMouseLeave(e.currentTarget)
							}
						/>
					</div>

					{/* Video Title */}
					<h2 className="text-xl font-semibold mb-1">
						{video.title}
					</h2>

					{/* Video Description */}
					<p className="mb-2">{video.description}</p>

					{/* Watch Video Link */}
					<Link
						href={`/videos/${video.id}`}
						className="text-blue-600 hover:underline"
					>
						Watch Video →
					</Link>
				</div>
			))}
		</>
	);
}
