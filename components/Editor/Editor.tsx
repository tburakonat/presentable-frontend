import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Menubar } from "@/components";
import styles from "./Editor.module.css";
import { useLocalStorage } from "usehooks-ts";
import { StorageKey, Template } from "@/types";
import { NodeHtmlMarkdown } from "node-html-markdown";
import {
	useCreateFeedbackMutation,
	useEditFeedbackMutation,
} from "@/helpers/mutations";
import { useRouter } from "next/router";
import { editorAtom, editorStore } from "@/atoms";

interface IEditorProps {
	presentationId: number;
}

export default function Editor(props: IEditorProps) {
	const router = useRouter();
	const { courseId, presentationId } = router.query;
	const [templates, setTemplates] = useLocalStorage<Template[]>(
		StorageKey.Templates,
		[
			{
				id: 1,
				name: "Default Template",
				content:
					"<h1>Feedback Template</h1><div><h2>Positive Feedback</h2></div><div><h2>Corrective Feedback</h2></div><div><h2>Recommendations</h2></div><div><h2>Additional Notes</h2></div><div><h2>Presentation Style</h2></div>",
			},
		]
	);

	const { mutateAsync: editFeedback } = useEditFeedbackMutation();
	const { mutateAsync: createFeedback } = useCreateFeedbackMutation(
		props.presentationId
	);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [StarterKit, Link],
		content: templates[0]?.content ?? "",
		onCreate: ({ editor }) => editorStore.set(editorAtom, editor),
	});

	const convertTimestampsToLinks = (htmlContent: string) => {
		// DOM-Parser verwenden, um den HTML-String zu analysieren
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlContent, "text/html");

		// TreeWalker für alle Textknoten erstellen
		const walker = document.createTreeWalker(
			doc.body,
			NodeFilter.SHOW_TEXT,
			null
		);

		const timestampRegex = /\b(\d{1,2}):(\d{2})\b/g;
		let node;

		// Alle Textknoten sammeln, die Timestamps enthalten
		const nodesToUpdate = [];
		while ((node = walker.nextNode())) {
			if (timestampRegex.test(node.nodeValue || "")) {
				nodesToUpdate.push(node);
			}
		}

		// Alle gefundenen Knoten durchlaufen und Timestamps ersetzen
		nodesToUpdate.forEach(node => {
			const textContent = node.nodeValue || "";
			const updatedContent = textContent.replace(
				timestampRegex,
				(match, minutes, seconds) => {
					const totalSeconds =
						parseInt(minutes) * 60 + parseInt(seconds);
					const currentPath = router.asPath;
					const updatedPath = `${
						currentPath.split("?")[0]
					}?t=${totalSeconds}`;
					return `<a href="${updatedPath}">${match}</a>`;
				}
			);

			// Aktualisierte Inhalte als HTML einsetzen
			const span = document.createElement("span");
			span.innerHTML = updatedContent;

			if (node.parentNode) {
				node.parentNode.replaceChild(span, node);
			}
		});

		// Den aktualisierten HTML-Inhalt zurückgeben
		return doc.body.innerHTML;
	};

	const addCorrectHrefsToLinks = (content: string, feedbackURL: string) => {
		// Regex für Timestamps (z. B. [1:20](/courses/1/presentations/1/feedbacks/new?t=80))
		const timestampRegex =
			/\[(\d{1,2}:\d{2})\]\((\/courses\/\d+\/presentations\/\d+\/feedbacks\/new\?t=\d+)\)/g;

		// Ersetze die Timestamps durch Links mit der richtigen href-URL
		return content.replace(timestampRegex, (match, timestamp, href) => {
			const totalSeconds =
				parseInt(timestamp.split(":")[0]) * 60 +
				parseInt(timestamp.split(":")[1]);
			return `[${timestamp}](${feedbackURL}?t=${totalSeconds})`;
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		if (!editor) return;

		const htmlContent = editor.getHTML();
		const processedContent = convertTimestampsToLinks(htmlContent);
		const markdown = NodeHtmlMarkdown.translate(processedContent);

		try {
			// 1. POST the feedback to the backend (hrefs are not correct yet because the feedback ID is not known. It looks like this: /courses/1/presentations/1/feedbacks/new?t=80)
			const response = await createFeedback(markdown);
			const feedback = response.data;

			// 2. PATCH the feedback content to add the correct hrefs to the timestamp links
			const feedbackLink = `/courses/${courseId}/presentations/${presentationId}/feedbacks/${feedback.id}`;

			const updatedFeedbackContent = addCorrectHrefsToLinks(
				feedback.content,
				feedbackLink
			);

			await editFeedback({
				feedbackId: feedback.id,
				content: updatedFeedbackContent,
			});

			// 3. Redirect to the feedback page
			router.push(
				`/courses/${courseId}/presentations/${presentationId}/feedbacks/${feedback.id}`
			);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={styles.editorContainer}>
			<Menubar
				editor={editor}
				templates={templates}
				setTemplates={setTemplates}
			/>
			<EditorContent editor={editor} />
			<button
				type="submit"
				className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 self-start"
				onClick={handleSubmit}
			>
				Submit Feedback
			</button>
		</div>
	);
}
