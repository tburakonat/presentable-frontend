import { useMutation } from "@tanstack/react-query";

import api from "./api";
import { useSession } from "@/context";
import { Event } from "@/types";

export const useChangeVisibilityMutation = (presentationId: number) => {
	return useMutation({
		mutationFn: (is_private: boolean) =>
			api.presentations.changeVisibility(presentationId, is_private),
	});
};

export const useCreateCommentMutation = (feedbackId: number) => {
	const { user } = useSession();
	return useMutation({
		mutationFn: ({
			content,
			repliesTo,
		}: {
			content: string;
			repliesTo: number | null;
		}) => api.comments.create(content, feedbackId, user!.id, repliesTo),
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

export const useEditFeedbackMutation = () => {
	return useMutation({
		mutationFn: ({
			feedbackId,
			content,
		}: {
			feedbackId: number;
			content: string;
		}) => api.feedbacks.edit(feedbackId, content),
	});
};

export const useEditEventsMutation = (presentationId: string) => {
	return useMutation({
		mutationFn: (events: Event) =>
			api.presentations.updateEvents(presentationId, events),
	});
};
