import { Tooltip } from "@/components";
import styles from "./Timestamp.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

interface ITimestampProps {
	timestamp: string;
	onTimestampClick: (time: number) => void;
}

export default function Timestamp(props: ITimestampProps) {
	const router = useRouter();

	// Convert timestamp to seconds
	const [mins, seconds] = props.timestamp.split(":");
	const timeInSeconds = parseInt(mins, 10) * 60 + parseInt(seconds, 10);

	// Create updated path with the query parameter
	const currentPath = router.asPath;
	const updatedPath = `${currentPath.split("?")[0]}?t=${timeInSeconds}`;

	// Handle timestamp click for custom behavior
	const handleClick = () => {
		props.onTimestampClick(timeInSeconds);
	};

	const customTooltip = (
		<span>Jump to {props.timestamp}</span>
	);

	return (
		<span className={styles.timestamp}>
			<Tooltip tooltipComponent={customTooltip}>
				<Link
					scroll={false}
					href={updatedPath}
					onClick={handleClick}
					className="text-blue-500"
				>
					{props.timestamp}
				</Link>
			</Tooltip>
		</span>
	);
}
