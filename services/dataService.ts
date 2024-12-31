const dataService = {
	async getCourses(access_token: string) {
		return fetch("http://localhost:8000/api/courses/", {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});
	},
	async getCourseById(access_token: string, courseId: string) {
		return fetch(`http://localhost:8000/api/courses/${courseId}`, {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});
	},
	async getPresentationsByCourseId(access_token: string, courseId: string) {
		return fetch(
			`http://localhost:8000/api/presentations/?course=${courseId}`,
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			}
		);
	},
	async getPresentationById(access_token: string, presentationId: string) {
		return fetch(
			`http://localhost:8000/api/presentations/${presentationId}`,
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			}
		);
	},
	async getFeedbacksByPresentationId(
		access_token: string,
		presentationId: string
	) {
		return fetch(
			`http://localhost:8000/api/feedbacks/?presentation=${presentationId}`,
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			}
		);
	},
	async getFeedbackById(access_token: string, feedbackId: string) {
		return fetch(`http://localhost:8000/api/feedbacks/${feedbackId}`, {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});
	},
	async getCommentsByFeedbackId(access_token: string, feedbackId: string) {
		return fetch(
			`http://localhost:8000/api/comments/?feedback=${feedbackId}`,
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			}
		);
	},
};

export default dataService;
