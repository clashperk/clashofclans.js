export function validateTag(tag: string, encode = false): string | false {
	if (!tag) return false;
	const _tag = tag.toUpperCase().replace(/O/g, '0').replace('#', '');
	const tagRegex = /[0289PYLQGRJCUV]{3,9}/g;
	const result = tagRegex.exec(_tag);
	return result ? encode ? encodeURIComponent(`#${result[0]}`) : `#${result[0]}` : false;
}
