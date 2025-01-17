import { Comment, Course, Feedback, Presentation, User } from "@/types";
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
	},
	comments: {
		getByFeedback: async (feedbackId: string) => {
			return apiClient.request<Comment[]>({
				url: `/comments/?feedback=${feedbackId}`,
				method: "GET",
			});
		},
	},
};
