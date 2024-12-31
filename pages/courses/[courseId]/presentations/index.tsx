import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { Course, Presentation } from "@/types";
import { dataService } from "@/services";

interface CoursePresentationsPageProps {
	course: Course;
	presentations: Presentation[];
}

function CoursePresentationsPage(props: CoursePresentationsPageProps) {
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
			<Head>
				<title>{`Alle Präsentationen für ${props.course.name}`}</title>
			</Head>
			<div className="container mx-auto p-6">
				<div className="">
					<h1 className="text-2xl mb-2">
						Präsentationen zum Kurs: {props.course.name}
					</h1>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{props.presentations.map(presentation => (
							<div
								key={presentation.id}
								className="flex flex-col justify-between dark:bg-slate-800 rounded-lg p-4 shadow-xl"
							>
								<div className="mb-4">
									<video
										className="w-full rounded-lg"
										src={presentation.video_url}
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

								<h2 className="text-xl font-semibold mb-1">
									{presentation.title}
								</h2>

								<p className="mb-2">
									{presentation.description}
								</p>

								<Link
									href={`/courses/${props.course.id}/presentations/${presentation.id}`}
									className="text-blue-600 hover:underline"
								>
									Watch Video →
								</Link>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

export default CoursePresentationsPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { access_token } = context.req.cookies;
	const { courseId } = context.params!;

	if (!access_token) {
		return {
			redirect: {
				destination: `/login?next=/courses/${courseId}/presentations`,
				permanent: false,
			},
		};
	}

	const courseResponse = await dataService.getCourseById(
		access_token,
		courseId as string
	);

	if (!courseResponse.ok && courseResponse.status === 401) {
		return {
			redirect: {
				destination: `/login?next=/courses/${courseId}/presentations`,
				permanent: false,
			},
		};
	}

	if (courseResponse.status === 404) {
		return {
			notFound: true,
		};
	};
	
	const course = await courseResponse.json();

	const response = await dataService.getPresentationsByCourseId(
		access_token,
		courseId as string
	);

	if (!response.ok && response.status === 401) {
		return {
			redirect: {
				destination: `/login?next=/courses/${courseId}/presentations`,
				permanent: false,
			},
		};
	};

	if (response.status === 400) {
		return {
			notFound: true,
		};
	}

	const presentations = await response.json();

	return {
		props: {
			presentations,
			course,
		},
	};
}
