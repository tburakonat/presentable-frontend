import Link from "next/link";

interface ErrorMessageProps {
	detail: string;
	status: number;
	statusText: string;
}

const ErrorMessage = (props: ErrorMessageProps) => {
	return (
		<>
			<h1 className="text-4xl font-bold">
				{props.status} {props.statusText}
			</h1>
			<p className="text-lg">{props.detail}</p>
			<div className="mt-6">
				<Link
					href="/"
					className="text-blue-500 hover:text-blue-700 underline"
				>
					Go back to Homepage
				</Link>
			</div>
		</>
	);
};

export default ErrorMessage;
