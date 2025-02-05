import { Editor } from "@tiptap/react";
import styles from "./Menubar.module.css";
import { Template } from "@/types";
import { Dispatch, SetStateAction } from "react";
import { Tooltip } from "@mui/material";

interface IMenubarProps {
	editor: Editor | null;
	templates: Template[];
	setTemplates: Dispatch<SetStateAction<Template[]>>;
}

export default function Menubar({
	editor,
	templates,
	setTemplates,
}: IMenubarProps) {
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
		if (!name) {
			return;
		}
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
		const saveTemplate = confirm(
			"Are you sure you want to delete this template?"
		);

		if (saveTemplate) {
			setTemplates(templates.filter(t => t.id !== templateId));
		}

		return;
	};

	return (
		<div
			className={`${styles.menubarContainer} p-2 bg-slate-800 rounded-t-lg text-white`}
		>
			<div className="flex gap-2">
				<Tooltip title="Bold">
					<button
						onClick={handleBold}
						className="cursor-pointer disabled:cursor-not-allowed
						disabled:text-gray-500 hover:text-blue-500 w-[30px] h-[30px]"
					>
						<i className="ri-bold"></i>
					</button>
				</Tooltip>
				<Tooltip title="Italic">
					<button
						onClick={handleItalic}
						className="cursor-pointer disabled:cursor-not-allowed
						disabled:text-gray-500 hover:text-blue-500 w-[30px] h-[30px]"
					>
						<i className="ri-italic"></i>
					</button>
				</Tooltip>
				<Tooltip title="Link">
					<button
						onClick={setLink}
						className="cursor-pointer disabled:cursor-not-allowed
						disabled:text-gray-500 hover:text-blue-500 w-[30px] h-[30px]"
					>
						<i className="ri-link"></i>
					</button>
				</Tooltip>
				<Tooltip title="Unlink">
					<button
						onClick={unsetLink}
						className="cursor-pointer disabled:cursor-not-allowed
						disabled:text-gray-500 hover:text-blue-500 w-[30px] h-[30px]"
					>
						<i className="ri-link-unlink"></i>
					</button>
				</Tooltip>
				<Tooltip title="Undo">
					<button
						onClick={handleUndo}
						className="cursor-pointer disabled:cursor-not-allowed
						disabled:text-gray-500 hover:text-blue-500 w-[30px] h-[30px]"
						disabled={!editor.can().undo()}
					>
						<i className="ri-arrow-go-back-line"></i>
					</button>
				</Tooltip>
				<Tooltip title="Redo">
					<button
						onClick={handleRedo}
						className="cursor-pointer disabled:cursor-not-allowed
						disabled:text-gray-500 hover:text-blue-500 w-[30px] h-[30px]"
						disabled={!editor.can().redo()}
					>
						<i className="ri-arrow-go-forward-line"></i>
					</button>
				</Tooltip>
			</div>
			<div className="flex gap-2">
				{templates.map(template => (
					<div
						key={template.id}
						className="flex gap-2 border border-white p-1 rounded-sm"
					>
						<Tooltip title={`Use template: ${template.name}`}>
							<button
								onClick={() => fillTemplate(template.id)}
								className="cursor-pointer disabled:cursor-not-allowed
								disabled:text-gray-500 hover:text-blue-500 w-[30px] h-[30px]"
								tabIndex={0}
							>
								<i className="ri-file-edit-fill"></i>
							</button>
						</Tooltip>
						<Tooltip title={`Delete template: ${template.name}`}>
							<button
								onClick={() => deleteTemplate(template.id)}
								className="cursor-pointer disabled:cursor-not-allowed
								disabled:text-gray-500 hover:text-blue-500 w-[30px] h-[30px]"
								tabIndex={0}
							>
								<i className="ri-delete-bin-line"></i>
							</button>
						</Tooltip>
					</div>
				))}
				{templates.length < 3 && (
					<Tooltip title="Create new template from current content">
						<button
							onClick={addTemplate}
							className="cursor-pointer disabled:cursor-not-allowed
							disabled:text-gray-500 hover:text-blue-500 w-[30px] h-[30px]"
						>
							<i className="ri-file-add-fill"></i>
						</button>
					</Tooltip>
				)}
			</div>
		</div>
	);
}
