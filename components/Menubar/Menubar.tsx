import { Editor } from "@tiptap/react";
import { useState } from "react";
import styles from "./Menubar.module.css";
import { Tooltip } from "@/components";

interface IMenubarProps {
	editor: Editor | null;
}

export default function Menubar({ editor }: IMenubarProps) {
	const [templates, setTemplates] = useState([
		{
			id: 1,
			name: "Default",
			content:
				"<h1>Feedback Template</h1><div><h2>Positive Feedback 🎉</h2></div><div><h2>Corrective Feedback 🛠️</h2></div><div><h2>Recommendations 💡</h2></div><div><h2>Additional Notes 📝</h2></div>",
		},
	]);

	if (!editor) {
		return null;
	}

	const handleBold = () => {
		editor.chain().focus().toggleBold().run();
	};

	const handleItalic = () => {
		editor.chain().focus().toggleItalic().run();
	};

	const setLink = () => {
		const previousUrl = editor.getAttributes("link").href;
		const url = window.prompt("URL", previousUrl);

		// cancelled
		if (url === null) {
			return;
		}

		// empty
		if (url === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();

			return;
		}

		// update link
		editor
			.chain()
			.focus()
			.extendMarkRange("link")
			.setLink({ href: url })
			.run();
	};

	const unsetLink = () => {
		editor.chain().focus().unsetLink().run();
	};

	const handleUndo = () => {
		editor.chain().focus().undo().run();
	};

	const handleRedo = () => {
		editor.chain().focus().redo().run();
	};

	const fillTemplate = (templateId: number) => {
		editor
			.chain()
			.focus()
			.clearContent()
			.insertContent(
				templates.find(template => template.id === templateId)
					?.content || ""
			)
			.run();
	};

	const addTemplate = () => {
		if (templates.length >= 5) {
			alert("You can only have 5 templates");
			return;
		}

		const name = prompt("Name your template");
		const newTemplateId = templates[templates.length - 1]?.id + 1 || 1;
		setTemplates([
			...templates,
			{
				id: newTemplateId,
				name: name || `Template ${newTemplateId}`,
				content: editor.getHTML(),
			},
		]);
	};

	const deleteTemplate = (templateId: number) => {
		const saveTemplate = confirm("Are you sure you want to delete this template?");

		if (!saveTemplate) {
			setTemplates(templates.filter(t => t.id !== templateId));
		}

		return;
	};

	return (
		<div className={styles.menubar}>
			<Tooltip tooltipComponent="Bold">
				<button onClick={handleBold}>
					<i className="ri-bold"></i>
				</button>
			</Tooltip>
			<Tooltip tooltipComponent="Italic">
				<button onClick={handleItalic}>
					<i className="ri-italic"></i>
				</button>
			</Tooltip>
			<Tooltip tooltipComponent="Link">
				<button onClick={setLink}>
					<i className="ri-link"></i>
				</button>
			</Tooltip>
			<Tooltip tooltipComponent="Unlink">
				<button onClick={unsetLink}>
					<i className="ri-link-unlink"></i>
				</button>
			</Tooltip>
			<Tooltip tooltipComponent="Undo">
				<button onClick={handleUndo} disabled={!editor.can().undo()}>
					<i className="ri-arrow-go-back-line"></i>
				</button>
			</Tooltip>
			<Tooltip tooltipComponent="Redo">
				<button onClick={handleRedo} disabled={!editor.can().redo()}>
					<i className="ri-arrow-go-forward-line"></i>
				</button>
			</Tooltip>
			<div className="ml-auto">
				{templates.map(template => (
					<span key={template.id} className={styles.template}>
						<Tooltip
							tooltipComponent={`Use template: ${template.name}`}
						>
							<button
								onClick={() => fillTemplate(template.id)}
								tabIndex={0}
							>
								<i className="ri-file-edit-fill"></i>
							</button>
						</Tooltip>
						<Tooltip
							tooltipComponent={`Delete template: ${template.name}`}
						>
							<button
								tabIndex={0}
								onClick={() => deleteTemplate(template.id)}
							>
								<i className="ri-delete-bin-line"></i>
							</button>
						</Tooltip>
					</span>
				))}
				<Tooltip
					tooltipComponent={
						"Create new template from current content"
					}
				>
					<button onClick={addTemplate}>
						<i className="ri-file-add-fill"></i>
					</button>
				</Tooltip>
			</div>
		</div>
	);
}
