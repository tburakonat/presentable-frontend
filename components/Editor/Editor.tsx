import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Menubar } from "@/components";
import styles from "./Editor.module.css";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { StorageKey, Template } from "@/types";

export default function Editor() {
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

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [StarterKit, Link],
		content: templates[0]?.content ?? "",
	});

	function processHTMLContent(htmlContent: string) {
		// Erzeuge ein DOM-Parser-Objekt
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlContent, "text/html");

		console.log("doc", doc);

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
					return `<a href="#t=${totalSeconds}s">${match}</a>`;
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
	}

	useEffect(() => {
		if (!editor) {
			return;
		}

		// Event-Listener für das "update" Ereignis hinzufügen
		editor.on("blur", ({ editor }) => {
			const htmlContent = editor.getHTML();
			const processedContent = processHTMLContent(htmlContent);
			console.log(processedContent);
		});
	}, [editor]);

	return (
		<div className={styles.editorContainer}>
			<Menubar
				editor={editor}
				templates={templates}
				setTemplates={setTemplates}
			/>
			<EditorContent editor={editor} />
		</div>
	);
}
