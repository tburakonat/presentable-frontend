import { ReactNode, useState } from "react";
import styles from "./Tooltip.module.css";

interface ITooltipProps {
	children: ReactNode;
	tooltipComponent: ReactNode;
	style?: React.CSSProperties;
}

function Tooltip(props: ITooltipProps) {
	const [isHovered, setIsHovered] = useState(false);
	const handleMouseEnter = () => setIsHovered(true);
	const handleMouseLeave = () => setIsHovered(false);

	return (
		<span
			className={styles.tooltipWrapper}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			style={props.style}
		>
			{props.children}
			{isHovered && (
				<span className={styles.tooltip}>{props.tooltipComponent}</span>
			)}
		</span>
	);
}

export default Tooltip;
