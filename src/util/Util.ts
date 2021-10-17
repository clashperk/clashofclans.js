export function encodeTag(tag: string) {
	return encodeURIComponent(parseTag(tag));
}

export function parseTag(tag: string) {
	return `#${tag.toUpperCase().replace(/O|o/g, '0').replace(/^#/g, '')}`;
}

export default {
	encodeTag,
	parseTag
};
