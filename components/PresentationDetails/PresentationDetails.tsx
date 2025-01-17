import { Presentation } from "@/types";
import { Tooltip } from "../Tooltip";
import { useSession } from "@/context";

interface IPresentationDetailsProps {
	presentation: Presentation;
}

function PresentationDetails({ presentation }: IPresentationDetailsProps) {
	const { user } = useSession();

	const changeVisibility = async () => {
		try {
			// Update the presentation visibility
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="rounded-lg">
			<h1 className="text-2xl md:text-3xl font-bold mb-4">
				{presentation.title}
			</h1>
			<p className="mb-4">{presentation.description}</p>
			<div className="text-sm">
				<p>
					<span className="font-semibold">Created By:</span>{" "}
					{presentation.created_by.first_name}{" "}
					{presentation.created_by.last_name}
				</p>
				<p>
					<span className="font-semibold">Uploaded On:</span>{" "}
					{new Date(presentation.created_at).toLocaleDateString(
						"de-DE"
					)}
				</p>
				{user?.id === presentation.created_by.id && (
					<p>
						<span className="font-semibold">Visibility:</span>{" "}
						<Tooltip
							tooltipComponent={
								presentation.is_private
									? "Make public"
									: "Make private"
							}
						>
							<button
								onClick={changeVisibility}
								className={`px-2 py-1 rounded-full text-xs font-medium ${
									presentation.is_private
										? "bg-red-500 text-white"
										: "bg-green-500 text-white"
								} hover:opacity-80`}
							>
								{presentation.is_private ? "Private" : "Public"}
							</button>
						</Tooltip>
					</p>
				)}
			</div>
		</div>
	);
}

export default PresentationDetails;
