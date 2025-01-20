import { atom, createStore } from "jotai";
import { Editor } from "@tiptap/react";

export const editorStore = createStore();
export const editorAtom = atom<Editor | null>(null);