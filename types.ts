export interface Feedback {
    id: number;
    presentation: Presentation;
    content: string;
    created_by: User;
    created_at: string;
}

export interface Comment {
    id: string;
    feedback: Feedback;
    content: string;
    created_at: string;
    created_by: User;
}

export interface Course {
    id: string;
    name: string;
    description: string;
    students: User[];
    teachers: User[];
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    role: UserRole;
}

export enum UserRole {
    TEACHER = "TEACHER",
    STUDENT = "STUDENT",
    ADMIN = "ADMIN",
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
    AccessToken = "presentable-access-token",
    RefreshToken = "presentable-refresh-token",
}

export enum VideoTab {
    Description = "#description",
    Events = "#events",
    Transcription = "#transcription",
    TranscriptionComments = "#transcription-comments",
    Comments = "#comments",
}

export type Presentation = {
	id: number;
	title: string;
	description: string;
	video_url: string;
	video_duration: string;
	presentation_events: Event;
	transcription: Transcript;
	created_by: User;
	course: Course;
	created_at: string;
    is_private: boolean;
};
