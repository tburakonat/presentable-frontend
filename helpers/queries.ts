import { useQueries, useQuery } from "@tanstack/react-query";

import api from "./api";
import { useSession } from "@/context";

export const useCoursesQuery = () => {
	const { user } = useSession();
	return useQuery({
		queryKey: ["courses"],
		queryFn: () => api.courses.getAll(),
		enabled: !!user,
	});
};

export const useCourseDetailsQuery = (courseId: string) => {
	const { user } = useSession();
	return useQueries({
		queries: [
			{
				queryKey: ["courses", courseId],
				queryFn: () => api.courses.getOne(courseId),
				enabled: !!courseId && !!user,
			},
			{
				queryKey: ["courses", courseId, "presentations"],
				queryFn: () => api.presentations.getByCourse(courseId),
				enabled: !!courseId && !!user,
			},
		],
	});
};

export const usePresentationQuery = (presentationId: string) => {
	const { user } = useSession();
	return useQuery({
		queryKey: ["presentations", presentationId],
		queryFn: () => api.presentations.getOne(presentationId),
		enabled: !!presentationId && !!user,
	});
};

export const usePresentationDetailsQuery = (presentationId: string) => {
	const { user } = useSession();
	return useQueries({
		queries: [
			{
				queryKey: ["presentations", presentationId],
				queryFn: () => api.presentations.getOne(presentationId),
				enabled: !!presentationId && !!user,
			},
			{
				queryKey: ["presentations", presentationId, "feedbacks"],
				queryFn: () => api.feedbacks.getByPresentation(presentationId),
				enabled: !!presentationId && !!user,
			},
		],
	});
};

export const useFeedbackDetailsQuery = (feedbackId: string) => {
	const { user } = useSession();
	return useQueries({
		queries: [
			{
				queryKey: ["feedbacks", feedbackId],
				queryFn: () => api.feedbacks.getOne(feedbackId),
				enabled: !!feedbackId && !!user,
			},
			{
				queryKey: ["feedbacks", feedbackId, "comments"],
				queryFn: () => api.comments.getByFeedback(feedbackId),
				enabled: !!feedbackId && !!user,
			},
		],
	});
};
