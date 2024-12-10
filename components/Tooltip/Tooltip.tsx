import { ReactNode, useState } from "react";
import styles from "./Tooltip.module.css";

interface ITooltipProps {
	children: ReactNode;
	tooltipComponent: ReactNode;
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
		>
			{props.children}
			{isHovered && (
				<span className={styles.tooltip}>
                    {props.tooltipComponent}
                </span>
			)}
		</span>
	);
}

export default Tooltip;
