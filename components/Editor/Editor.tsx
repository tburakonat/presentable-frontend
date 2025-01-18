import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Menubar } from "@/components";
import styles from "./Editor.module.css";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { StorageKey, Template } from "@/types";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { useCreateFeedbackMutation } from "@/helpers/mutations";
import { useRouter } from "next/router";

interface IEditorProps {
	presentationId: number;
}

export default function Editor(props: IEditorProps) {
	const router = useRouter();
	const [templates, setTemplates] = useLocalStorage<Template[]>(
		StorageKey.Templates,
		[
			{
				id: 1,
				name: "Default Template",
				content:
					"<h1>Feedback Template</h1><div><h2>Positive Feedback 🎉</h2></div><div><h2>Corrective Feedback 🛠️</h2></div><div><h2>Recommendations 💡</h2></div><div><h2>Additional Notes 📝</h2></div><div><h2>Presentation Style 🗣</h2></div>",
			},
		]
	);

	const { mutateAsync } = useCreateFeedbackMutation(props.presentationId);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [StarterKit, Link],
		content: templates[0]?.content ?? "",
	});

	const processHTMLContent = (htmlContent: string) => {
		// Erzeuge ein DOM-Parser-Objekt
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlContent, "text/html");

		// Alle Texte im HTML-Dokument durchgehen
		const walker = document.createTreeWalker(
			doc.body,
			NodeFilter.SHOW_TEXT,
			null
		);

		let node;
		// Regex für Timestamps (z. B. 02:13)
		const timestampRegex = /\b(\d{1,2}):(\d{2})\b/g;

		while ((node = walker.nextNode())) {
			const textContent = node.nodeValue;
			if (!textContent) {
				continue;
			}

			// Falls der Text Timestamps enthält, ersetze sie durch Links
			const updatedContent = textContent.replace(
				timestampRegex,
				(match, minutes, seconds) => {
					const totalSeconds =
						parseInt(minutes) * 60 + parseInt(seconds);
					const currentPath = router.asPath;
					const updatedPath = `${
						currentPath.split("?")[0]
					}?t=${totalSeconds}`;
					return `<a href="?t=${totalSeconds}">${match}</a>`;
				}
			);

			if (updatedContent !== textContent) {
				if (!node.parentNode) {
					continue;
				}

				const span = document.createElement("span");
				span.innerHTML = updatedContent;
				node.parentNode.replaceChild(span, node);
			}
		}

		// Den aktualisierten HTML-Inhalt zurückgeben
		return doc.body.innerHTML;
	};

	// TODO: Timestamps sollen den richtigen Link erhalten
	// TODO: Probleme mit dem Speichern von Feedback mit Emojis beheben
	const handleSubmit = async (e: React.FormEvent) => {
		if (!editor) return;

		const htmlContent = editor.getHTML();
		const processedContent = processHTMLContent(htmlContent);
		const markdown = NodeHtmlMarkdown.translate(processedContent);
		try {
			const response = await mutateAsync(markdown);
			const feedback = response.data;
			const { courseId, presentationId } = router.query;
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
