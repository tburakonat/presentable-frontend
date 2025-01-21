import { Comment, Course, Event, Feedback, Presentation, User } from "@/types";
import axios from "axios";

const apiClient = axios.create({
	baseURL: process.env.API_URL || "http://localhost:8000/api",
	withCredentials: true,
});

export const setAuthToken = (token: string) => {
	apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default {
	session: {
		login: async (username: string, password: string) => {
			return apiClient.request<{ access: string; refresh: string }>({
				url: "/token/",
				method: "POST",
				data: { username, password },
			});
		},
		verifyToken: async (token: string) => {
			return apiClient.request({
				url: "/token/verify/",
				method: "POST",
				data: { token },
			});
		},
		getMe: async () => {
			return apiClient.request<User>({
				url: "/users/me/",
				method: "GET",
			});
		},
	},
	courses: {
		getAll: () => {
			return apiClient.request<Course[]>({
				url: "/courses/",
				method: "GET",
			});
		},
		getOne: async (id: string) => {
			return apiClient.request<Course>({
				url: `/courses/${id}/`,
				method: "GET",
			});
		},
	},
	presentations: {
		getOne: async (id: string) => {
			return apiClient.request<Presentation>({
				url: `/presentations/${id}/`,
				method: "GET",
			});
		},
		getByCourse: async (courseId: string) => {
			return apiClient.request<Presentation[]>({
				url: `/presentations/?course=${courseId}`,
				method: "GET",
			});
		},
		changeVisibility: async (
			presentationId: number,
			is_private: boolean
		) => {
			return apiClient.request<Presentation>({
				url: `/presentations/${presentationId}/`,
				method: "PATCH",
				data: { is_private },
			});
		},
		updateEvents: async (presentationId: string, events: Event) => {
			return apiClient.request<Presentation>({
				url: `/presentations/${presentationId}/`,
				method: "PATCH",
				data: { presentation_events: events },
			});
		},
	},
	feedbacks: {
		getOne: async (id: string) => {
			return apiClient.request<Feedback>({
				url: `/feedbacks/${id}/`,
				method: "GET",
			});
		},
		getByPresentation: async (presentationId: string) => {
			return apiClient.request<Feedback[]>({
				url: `/feedbacks/?presentation=${presentationId}`,
				method: "GET",
			});
		},
		create: async (
			content: string,
			presentationId: number,
			userId: number
		) => {
			return apiClient.request<Feedback>({
				url: "/feedbacks/",
				method: "POST",
				data: {
					content,
					presentation: presentationId,
					created_by: userId,
				},
			});
		},
		delete: async (id: number) => {
			return apiClient.request({
				url: `/feedbacks/${id}/`,
				method: "DELETE",
			});
		},
		edit: async (id: number, content: string) => {
			return apiClient.request<Feedback>({
				url: `/feedbacks/${id}/`,
				method: "PATCH",
				data: { content },
			});
		},
	},
	comments: {
		getByFeedback: async (feedbackId: string) => {
			return apiClient.request<Comment[]>({
				url: `/comments/?feedback=${feedbackId}`,
				method: "GET",
			});
		},
		create: async (
			content: string,
			feedback: number,
			created_by: number
		) => {
			const response = await apiClient.request<Comment>({
				url: "/comments/",
				method: "POST",
				data: { content, feedback, created_by },
			});
			return response;
		},
		delete: async (id: number) => {
			return apiClient.request({
				url: `/comments/${id}/`,
				method: "DELETE",
			});
		},
	},
};
