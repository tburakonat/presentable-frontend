export interface Feedback {
    id: number;
    teacher: {
        id: number;
        user: User;
    },
    content: string;
    created_at: string;
    presentation: Video;
}

export interface Comment {
    id: string;
    user: User;
    feedback: Feedback;
    content: string;
    created_at: string;
}

export interface Video {
    id: number;
    title: string;
    description: string;
    video_url: string;
    video_duration: string;
    student: {
        id: number;
        user: User;
    };
    created_at: string;
    presentation_events: Event;
    transcription: Transcript;
    course: Course;
}

export interface Course {
    id: string;
    name: string;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    date_joined: string;
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
