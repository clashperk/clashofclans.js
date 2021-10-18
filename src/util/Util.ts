export function encodeTag(tag: string) {
	return encodeURIComponent(parseTag(tag));
}

export function parseTag(tag: string) {
	return `#${tag.toUpperCase().replace(/O|o/g, '0').replace(/^#/g, '')}`;
}

export function parseDate(time: string) {
	return new Date(
		`${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)}T${time.slice(9, 11)}:${time.slice(11, 13)}:${time.slice(13)}`
	);
}

export default {
	encodeTag,
	parseTag,
	parseDate
};
