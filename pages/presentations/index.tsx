import Link from "next/link";
import { useState } from "react";
import moment from "moment";

import { Loading, withAuth } from "@/components";
import { usePresentationsQuery } from "@/helpers/queries";

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
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-xl font-bold">Presentations</h1>
				<input
					type="text"
					value={searchText}
					placeholder="Filter by text"
					onChange={e => setSearchText(e.target.value)}
					className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				/>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredPresentations.map(presentation => (
					<Link
						key={presentation.id}
						href={`/courses/${presentation.course.id}/presentations/${presentation.id}`}
						className="block bg-white border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
					>
						<div className="mb-4">
							<h2 className="font-bold text-lg">
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
	);
}

export default withAuth(PresentationPage);
