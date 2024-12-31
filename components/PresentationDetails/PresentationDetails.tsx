import { Presentation } from "@/types";

interface IPresentationDetailsProps {
	presentation: Presentation;
}

function PresentationDetails({ presentation }: IPresentationDetailsProps) {
	return (
		<div className="rounded-lg">
			<h1 className="text-2xl md:text-3xl font-bold mb-4">
				{presentation.title}
			</h1>
			<p className="mb-4">{presentation.description}</p>
			<div className="text-sm">
				<p>
					<span className="font-semibold">Created By:</span>{" "}
					{presentation.created_by.first_name}{" "}{presentation.created_by.last_name}
				</p>
				<p>
					<span className="font-semibold">Uploaded On:</span>{" "}
					{new Date(presentation.created_at).toLocaleDateString("de-DE")}
				</p>
			</div>
		</div>
	);
}

export default PresentationDetails;