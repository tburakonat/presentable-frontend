import { useMutation } from "@tanstack/react-query";

import api from "./api";
import { useSession } from "@/context";

export const useChangeVisibilityMutation = (presentationId: number) => {
	return useMutation({
		mutationFn: (is_private: boolean) =>
			api.presentations.changeVisibility(presentationId, is_private),
	});
};

export const useCreateCommentMutation = (feedbackId: number) => {
	const { user } = useSession();
	return useMutation({
		mutationFn: (content: string) =>
			api.comments.create(content, feedbackId, user!.id),
	});
};

export const useDeleteCommentMutation = () => {
	return useMutation({
		mutationFn: (commentId: number) => api.comments.delete(commentId),
	});
};

export const useCreateFeedbackMutation = (presentationId: number) => {
	const { user } = useSession();
	return useMutation({
		mutationFn: (content: string) =>
			api.feedbacks.create(content, presentationId, user!.id),
	});
};

export const useDeleteFeedbackMutation = () => {
	return useMutation({
		mutationFn: (feedbackId: number) => api.feedbacks.delete(feedbackId),
	});
};
