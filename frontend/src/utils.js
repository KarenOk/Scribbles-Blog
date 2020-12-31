export const parseDateTime = dateTime => {
	const splitDateTime = dateTime.split(" ");
	const date = splitDateTime[0];
	const time = splitDateTime[1];
	const splitDate = date.split("/");
	const splitTime = time.split(":");

	const parts = {};
	parts.year = Number(splitDate[2]);
	parts.month = Number(splitDate[1]) - 1;
	parts.day = Number(splitDate[0]);
	parts.hours = Number(splitTime[0]);
	parts.minutes = Number(splitTime[1]);
	parts.seconds = Number(splitTime[2]);

	return parts;
};

export const formattedDatePost = dateTime => {
	const { year, month, day, hours, minutes, seconds } = parseDateTime(dateTime);
	return new Date(year, month, day, hours, minutes, seconds).toLocaleDateString(undefined, {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	});
};

export const formattedDateComment = dateTime => {
	const { year, month, day, hours, minutes, seconds } = parseDateTime(dateTime);
	return new Date(year, month, day, hours, minutes, seconds).toLocaleString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
};

export const formattedTime = dateTime => {
	const { year, month, day, hours, minutes, seconds } = parseDateTime(dateTime);
	return new Date(year, month, day, hours, minutes, seconds).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit"
	});
};
