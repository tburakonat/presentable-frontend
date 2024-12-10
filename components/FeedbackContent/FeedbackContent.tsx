import ReactMarkdown, { ExtraProps } from "react-markdown";
import { Timestamp } from "@/components";
import Link from 'next/link';
import styles from "./FeedbackContent.module.css";
import { AnchorHTMLAttributes, ClassAttributes } from "react";

interface IFeedbackProps {
    feedback: string;
    onTimestampClick: (time: number) => void;
}

export default function FeedbackContent(props: IFeedbackProps) {
    const renderLinkOrTimestamp = (data: ClassAttributes<HTMLAnchorElement> & AnchorHTMLAttributes<HTMLAnchorElement> & ExtraProps) => {
        const { href, children, ...rest } = data;
        const timestampPattern = /^\d{1,2}:\d{2}$/;
            
        if (timestampPattern.test(data.children?.toString() || "") && !href) {
            return (
                <Timestamp 
                    timestamp={data.children as string}
                    onTimestampClick={props.onTimestampClick}
                />
            )
        };

        return (
            <Link 
                href={href!} 
                target="_blank"
                className="text-blue-500"
                {...rest} 
                >
                    {children}
                </Link>
        );
    }

    return (
        <ReactMarkdown 
            components={{ a: renderLinkOrTimestamp }} 
            className={`${styles.feedbackContent}`}
        >
            {props.feedback}
        </ReactMarkdown>
    );
}
