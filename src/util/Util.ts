export default class Util {
	public encodeTag(tag: string) {
		return encodeURIComponent(this.parseTag(tag));
	}

	public parseTag(tag: string) {
		if (tag && typeof tag === 'string') {
			return `#${tag.toUpperCase().replace(/O|o/g, '0').replace(/^#/g, '')}`;
		}
		throw TypeError('The "tag" argument must be of type string.');
	}
}
