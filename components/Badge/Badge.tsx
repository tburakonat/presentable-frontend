import { PropsWithChildren } from "react";

interface BadgeProps extends PropsWithChildren {
	color: "red" | "green" | "blue";
}

export default function Badge(props: BadgeProps) {
	return (
		<span
			className={`inline-flex items-center rounded-md bg-${props.color}-50 px-2 py-1 text-xs font-medium text-${props.color}-700 ring-1 ring-inset ring-${props.color}-600/10`}
		>
			{props.children}
		</span>
	);
}
