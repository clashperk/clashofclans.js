function encodeTag(tag: string) {
	return encodeURIComponent(parseTag(tag));
}

function parseTag(tag: string) {
	return `#${tag.toUpperCase().replace(/O|o/g, '0').replace(/^#/g, '')}`;
}

function parseDate(time: string) {
	return new Date(
		`${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)}T${time.slice(9, 11)}:${time.slice(11, 13)}:${time.slice(13)}`
	);
}

function queryString(options = {}) {
	const query = new URLSearchParams(options);
	query.delete('restRequestTimeout');
	query.delete('ignoreRateLimit');
	query.delete('retryLimit');
	return query.toString();
}

function getSeasonEnd(month: number, autoFix = true): Date {
	const now = new Date();
	now.setUTCMonth(month, 0);
	now.setUTCHours(5, 0, 0, 0);

	const newDate = now.getUTCDay() === 0 ? now.getUTCDate() - 6 : now.getUTCDate() - (now.getUTCDay() - 1);
	now.setUTCDate(newDate);

	if (Date.now() >= now.getTime() && autoFix) {
		return getSeasonEnd(month + 1);
	}

	return now;
}

function getSeasonId() {
	return getSeasonEndTime().toISOString().substring(0, 7);
}

function getSeasonEndTime(date = new Date()) {
	return getSeasonEnd(date.getUTCMonth() + 1);
}

async function allSettled<T>(values: Promise<T>[]) {
	return (await Promise.allSettled(values))
		.filter((res) => res.status === 'fulfilled')
		.map((res) => (res as PromiseFulfilledResult<T>).value);
}

export default {
	encodeTag,
	parseTag,
	parseDate,
	queryString,
	getSeasonId,
	getSeasonEndTime,
	allSettled
};
