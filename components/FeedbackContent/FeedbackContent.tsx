import ReactMarkdown, { ExtraProps } from "react-markdown";
import { Timestamp } from "@/components";
import Link from 'next/link';
import styles from "./FeedbackContent.module.css";
import { AnchorHTMLAttributes, ClassAttributes, QuoteHTMLAttributes } from "react";

interface IFeedbackProps {
    feedback: string;
    onTimestampClick: (time: number) => void;
}

export default function FeedbackContent(props: IFeedbackProps) {
    const renderLinkOrTimestamp = (data: ClassAttributes<HTMLAnchorElement> & AnchorHTMLAttributes<HTMLAnchorElement> & ExtraProps) => {
        const { href, children, ...rest } = data;
        const timestampPattern = /^\d{1,2}:\d{2}$/;
            
        if (timestampPattern.test(data.children?.toString() || "")) {
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

    const renderBlockquote = (data: ClassAttributes<HTMLQuoteElement> & QuoteHTMLAttributes<HTMLQuoteElement> & ExtraProps) => {
        const { children } = data;
        return (
            <blockquote className="border-l-4 border-blue-400 pl-4 my-4">
                {children}
            </blockquote>
        );
    };

    function convertLineBreaks(content: string) {
        return content.replace(/\\n/g, '\n'); // i need this because the backend saves the feedback with \\n instead of \n
    }

    return (
        <ReactMarkdown 
            components={{ 
                a: renderLinkOrTimestamp, 
                blockquote: renderBlockquote
            }} 
            className={`${styles.feedbackContent}`}
        >
            {convertLineBreaks(props.feedback)}
        </ReactMarkdown>
    );
}
