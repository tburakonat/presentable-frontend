import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useSession } from "@/context";
import { useCourseDetailsQuery } from "@/helpers/queries";
import { Breadcrumbs, withAuth } from "@/components";

interface CourseDetailsPageProps {}

function CourseDetailsPage(props: CourseDetailsPageProps) {
	const { user } = useSession();
	const router = useRouter();

	const [courseQuery, presentationQuery] = useCourseDetailsQuery(
		router.query.courseId as string
	);

	if (courseQuery.isLoading || presentationQuery.isLoading) {
		return <p>Loading...</p>;
	}

	if (courseQuery.error || presentationQuery.error) {
		return (
			<p>
				{courseQuery.error?.message || presentationQuery.error?.message}
			</p>
		);
	}

	const course = courseQuery.data?.data;
	const presentations = presentationQuery.data?.data;

	if (!course) {
		return <p>Course not found</p>;
	}

	const breadcrumbs = [
		{ title: "Dashboard", link: "/dashboard" },
		{ title: "Courses", link: "/courses" },
		{ title: course.name, link: `/courses/${course.id}` },
	];

	const myPresentations = presentations
		? user?.role === "TEACHER"
			? presentations.filter(presentation => !presentation.is_private)
			: presentations.filter(
					presentation => presentation.created_by.id === user?.id
			  )
		: [];

	return (
		<>
			<Head>
				<title>{course.name}</title>
			</Head>
			<div className="p-6">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<h1 className="text-2xl mb-2 mt-6">{course.name}</h1>
				<p className="mb-8">{course.description}</p>
				{course.students
					.map(student => student.id)
					.includes(user!.id) ||
				course.teachers
					.map(teacher => teacher.id)
					.includes(user!.id) ? (
					<>
						<h2 className="text-2xl">
							Präsentationen in diesem Kurs
						</h2>
						{myPresentations.length === 0 ? (
							<p>Keine Präsentationen vorhanden.</p>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
								{myPresentations.map(presentation => (
									<Link
										key={presentation.id}
										className="block bg-white dark:bg-slate-800 border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
										href={`/courses/${course.id}/presentations/${presentation.id}`}
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
		</>
	);
}

export default withAuth(CourseDetailsPage);
