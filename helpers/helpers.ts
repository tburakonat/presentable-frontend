export const convertTimestampToSeconds = (timestamp: string): number => {
	const [hours, minutes, seconds] = timestamp.split(":").map(Number);
	const [sec, millisec] = seconds.toString().split(".").map(Number);
	return hours * 3600 + minutes * 60 + sec + (millisec || 0) / 1000;
};
