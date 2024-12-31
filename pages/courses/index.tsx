import { useAuth } from "@/context/AuthContext";
import { dataService } from "@/services/";
import { Course } from "@/types";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Link from "next/link";

interface CoursesPageProps {
	courses: Course[];
}

export default function CoursesPage(props: CoursesPageProps) {
	const {user} = useAuth();

	if (!user) {
		return null;
	}
	
	const myCourses = props.courses.filter(course => {
		if (user.role === "STUDENT") {
			return course.students.map(student => student.id).includes(user!.id);
		} else if (user.role === "TEACHER") {
			return course.teachers.map(teacher => teacher.id).includes(user!.id);
		} else {
			return false;
		}
	});

	return (
		<>
			<Head>
				<title>Alle Kurse</title>
			</Head>
			<div className="container mx-auto p-4">
				<div className="mb-8">
					<h2 className="text-4xl mb-6">Alle Kurse</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{props.courses.map(course => (
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
					<h2 className="text-4xl mb-6">Meine Kurse</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{myCourses.map(course => (
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
			</div>
		</>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { access_token } = context.req.cookies;

	if (!access_token) {
		return {
			redirect: {
				destination: "/login?next=/courses",
				permanent: false,
			},
		};
	}

	const response = await dataService.getCourses(access_token);

	if (!response.ok && response.status === 401) {
		return {
			redirect: {
				destination: "/login?next=/courses",
				permanent: false,
			},
		};
	}

	const courses = await response.json();

	return {
		props: {
			courses,
		},
	};
}
