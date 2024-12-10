import { Video } from "@/types";

interface IVideoDetails {
	video: Video;
}

export default function VideoDetails({ video }: IVideoDetails) {
	return (
		<div className="rounded-lg">
			<h1 className="text-2xl md:text-3xl font-bold mb-4">
				{video.title}
			</h1>
			<p className="mb-4">{video.description}</p>
			<div className="text-sm">
				<p>
					<span className="font-semibold">Created By:</span>{" "}
					{video.createdBy}
				</p>
				<p>
					<span className="font-semibold">Uploaded On:</span>{" "}
					{new Date(video.createdAt).toLocaleDateString("de-DE")}
				</p>
			</div>
		</div>
	);
}
