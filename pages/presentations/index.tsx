import Link from "next/link";
import { useState } from "react";
import moment from "moment";

import { Breadcrumbs, Loading, withAuth } from "@/components";
import { usePresentationsQuery } from "@/helpers/queries";
import Head from "next/head";

const breadcrumbs = [
	{ title: "Dashboard", link: "/dashboard" },
	{ title: "Presentations", link: "/presentations" },
];

function PresentationPage() {
	const presentationsQuery = usePresentationsQuery();
	const [searchText, setSearchText] = useState("");

	if (presentationsQuery.isLoading) {
		return <Loading />;
	}

	if (presentationsQuery.isError) {
		return <div>{presentationsQuery.error.message}</div>;
	}

	const filteredPresentations = presentationsQuery.data!.data.filter(
		presentation =>
			presentation.title
				.toLowerCase()
				.includes(searchText.toLowerCase()) ||
			`${presentation.created_by.first_name} ${presentation.created_by.last_name}`
				.toLowerCase()
				.includes(searchText.toLowerCase()) ||
			presentation.course.name
				.toLowerCase()
				.includes(searchText.toLowerCase())
	);

	return (
		<>
			<Head>
				<title>Presentations</title>
			</Head>
			<div className="p-6">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<div className="flex flex-col items-start gap-2 my-6 sm:flex-row sm:items-center sm:justify-between">
					<h1 className="text-2xl">Presentations</h1>
					<input
						type="text"
						value={searchText}
						placeholder="Filter by text"
						onChange={e => setSearchText(e.target.value)}
						className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block sm:max-w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredPresentations.map(presentation => (
						<Link
							key={presentation.id}
							href={`/courses/${presentation.course.id}/presentations/${presentation.id}`}
							className="block bg-white dark:bg-slate-800 border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
						>
							<div className="mb-4">
								<h2 className="font-bold text-xl">
									{presentation.title}
								</h2>
								<span className="text-sm">
									in {presentation.course.name}
								</span>
							</div>
							<p>
								{presentation.created_by.first_name}{" "}
								{presentation.created_by.last_name}
							</p>
							<p className="text-sm">
								{moment(presentation.created_at)
									.locale("de")
									.format("DD. MMMM YYYY")}
							</p>
						</Link>
					))}
				</div>
			</div>
		</>
	);
}

export default withAuth(PresentationPage);
