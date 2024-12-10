import Link from "next/link";

export default function HomePage() {
	return (
		<div className="mt-52 flex flex-col items-center justify-center">
			<div className="max-w-4xl text-center px-6">
				<h1 className="text-4xl md:text-5xl font-bold mb-6">
					Welcome to the Student Presentation Hub
				</h1>
				<p className="text-lg md:text-xl mb-8">
					This platform is designed to showcase student presentations
					in a structured and interactive way. Watch videos, explore
					feedback, and gain insights from the creativity and effort
					of students.
				</p>
				<div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
					<Link
						href="/videos"
						className="px-6 py-3 font-semibold rounded-lg shadow-md bg-blue-600 text-white hover:bg-blue-700 transition"
					>
						Explore Presentations
					</Link>
					<Link
						href="/about"
						className="px-6 py-3 font-semibold rounded-lg shadow-md bg-slate-600 text-white hover:bg-slate-700 transition"
					>
						Learn More
					</Link>
				</div>
			</div>
			<footer className="mt-16 text-sm">
				© {new Date().getFullYear()} Student Presentation Hub. All
				rights reserved.
			</footer>
		</div>
	);
}
