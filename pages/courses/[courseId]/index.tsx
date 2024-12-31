import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { Course, Presentation } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { dataService } from "@/services";

interface CourseDetailsPageProps {
	course: Course;
	presentations: Presentation[];
}

export default function CourseDetailsPage(props: CourseDetailsPageProps) {
	const { user } = useAuth();

	if (!user) {
		return null;
	}

	const presentations =
		user?.role === "TEACHER"
			? props.presentations
			: props.presentations.filter(
					presentation => presentation.created_by.id === user?.id
			  );

	return (
		<>
			<Head>
				<title>{props.course.name}</title>
			</Head>
			<div className="container mx-auto p-6">
				<div className="">
					<h1 className="text-2xl mb-2">{props.course.name}</h1>
					<p className="mb-8">{props.course.description}</p>
					{props.course.students
						.map(student => student.id)
						.includes(user!.id) ||
					props.course.teachers
						.map(teacher => teacher.id)
						.includes(user!.id) ? (
						<>
							<h2 className="text-2xl">
								Präsentationen in diesem Kurs
							</h2>
							{presentations.length === 0 ? (
								<p>Keine Präsentationen vorhanden.</p>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
									{presentations.map(presentation => (
										<Link
											key={presentation.id}
											className="p-4 shadow-md rounded-md bg-gray-100"
											href={`/courses/${props.course.id}/presentations/${presentation.id}`}
										>
											<h3 className="text-xl">
												{presentation.title}
												<span className="text-sm">
													{" von "}
													{
														presentation.created_by
															.username
													}
												</span>
											</h3>
											<p className="text-sm">
												{presentation.description}
											</p>
										</Link>
									))}
								</div>
							)}
						</>
					) : (
						<>
							<p>Du bist nicht eingeschrieben.</p>
							<button className="bg-blue-500 text-white px-4 py-2 rounded-md">
								Einschreiben
							</button>
						</>
					)}
				</div>
			</div>
		</>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { access_token } = context.req.cookies;
	const { courseId } = context.params!;

	if (!access_token) {
		return {
			redirect: {
				destination: `/login?next=/courses/${courseId}`,
				permanent: false,
			},
		};
	}

	const response = await dataService.getCourseById(
		access_token,
		courseId as string
	);

	if (!response.ok && response.status === 401) {
		return {
			redirect: {
				destination: `/login?next=/courses/${courseId}`,
				permanent: false,
			},
		};
	}

	if (!response.ok && response.status === 404) {
		return {
			notFound: true,
		};
	}

	const presentationsResponse = await dataService.getPresentationsByCourseId(
		access_token,
		courseId as string
	);

	if (!presentationsResponse.ok && presentationsResponse.status === 401) {
		return {
			redirect: {
				destination: `/login?next=/courses/${courseId}`,
				permanent: false,
			},
		};
	}

	const presentations = await presentationsResponse.json();

	const course = await response.json();

	return {
		props: {
			course,
			presentations,
		},
	};
}
