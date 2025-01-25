import Head from "next/head";
import Link from "next/link";

import { useSession } from "@/context";
import { useCoursesQuery } from "@/helpers/queries";
import { Breadcrumbs, withAuth } from "@/components";

const breadcrumbs = [
	{ title: "Dashboard", link: "/dashboard" },
	{ title: "Courses", link: "/courses" },
];

function CoursesPage() {
	const { isLoading, error, data: courses } = useCoursesQuery();
	const { user } = useSession();

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>{error.message}</p>;
	}

	if (!courses) {
		return <p>No courses found</p>;
	}

	const myCourses = courses.data?.filter(course => {
		if (user?.role === "STUDENT") {
			return course.students
				.map(student => student.id)
				.includes(user?.id);
		} else if (user?.role === "TEACHER") {
			return course.teachers
				.map(teacher => teacher.id)
				.includes(user?.id);
		} else {
			return false;
		}
	});

	return (
		<>
			<Head>
				<title>Courses</title>
			</Head>
			<div className="container mx-auto p-6">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<div className="my-6">
					<h2 className="text-2xl mb-6">Alle Kurse</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{courses.data.map(course => (
							<Link
								key={course.id}
								href={`/courses/${course.id}`}
								className="block bg-white border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
							>
								<h4 className="text-2xl">{course.name}</h4>
								<p>
									{course.teachers.map(teacher => (
										<span key={teacher.id}>
											{teacher.first_name}{" "}
											{teacher.last_name}
										</span>
									))}
								</p>
							</Link>
						))}
					</div>
				</div>
				<div className="mb-8">
					<h2 className="text-2xl mb-6">Meine Kurse</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{myCourses.map(course => (
							<Link
								key={course.id}
								href={`/courses/${course.id}`}
								className="block bg-white border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
							>
								<h4 className="text-xl">{course.name}</h4>
								<p>
									{course.teachers.map(teacher => (
										<span key={teacher.id}>
											{teacher.first_name}{" "}
											{teacher.last_name}
										</span>
									))}
								</p>
							</Link>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

export default withAuth(CoursesPage);
