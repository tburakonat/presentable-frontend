export interface Feedback {
    id: string;
    content: string;
    createdBy: string;
    createdAt: string;
    comments: Comment[];
}

export interface Comment {
    id: string;
    content: string;
    createdBy: string;
    createdAt: string;
}

export interface Video {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    videoDuration: string;
    createdBy: string;
    createdAt: string;
    feedback: Feedback[];
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}

export enum UserRole {
    TEACHER = "TEACHER",
    STUDENT = "STUDENT",
}

export interface Event {
    RecordingID: string;
    Intervals: {
        start: string;
        end: string;
        annotations: {
            feedbackFired: boolean;
            feedbackMessage: string;
        };
    }[]
}

export interface Transcript {
    RecordingID: string;
    Intervals: {
        start: string;
        end: string;
        text: string;
        sentences: {
            start: string;
            end: string;
            text: string;
        }[]
    }[]
}

export type Template = {
	id: number;
	name: string;
	content: string;
};

export enum StorageKey {
	Templates = "presentable-feedback-editor-templates",
}

export enum VideoTab {
    Description = "#description",
    Events = "#events",
    Transcription = "#transcription",
    Comments = "#comments",
}
