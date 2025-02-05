import { Presentation } from "@/types";
import { useSession } from "@/context";
import { useChangeVisibilityMutation } from "@/helpers/mutations";
import { Badge } from "@/components";
import { Tooltip } from "@mui/material";

interface IPresentationDetailsProps {
	presentation: Presentation;
}

function PresentationDetails({ presentation }: IPresentationDetailsProps) {
	const { user } = useSession();
	const { mutate } = useChangeVisibilityMutation(presentation.id);

	const changeVisibility = async () => {
		try {
			mutate(!presentation.is_private);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
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
							title={
								presentation.is_private
									? "Make public"
									: "Make private"
							}
						>
							<button onClick={changeVisibility}>
								{presentation.is_private ? (
									<Badge color="red">Private</Badge>
								) : (
									<Badge color="green">Public</Badge>
								)}
							</button>
						</Tooltip>
					</p>
				)}
			</div>
		</div>
	);
}

export default PresentationDetails;
