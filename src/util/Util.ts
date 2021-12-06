const TAG_CHARACTERS = '0289PYLQGRJCUV' as const;

/** Contains various general-purpose utility methods. */
export class Util extends null {
	/**
	 * Corrects malformed tags to match how they are formatted.
	 * ```ts
	 * Util.formatTag("PccVqqGO"); // #PCCVQQG0
	 * ```
	 */
	public static formatTag(tag: string) {
		return this.parseTag(tag);
	}

	/** @internal */
	public static parseTag(tag: string) {
		return `#${tag.toUpperCase().replace(/O/g, '0').replace(/^#/g, '').replace(/\s/g, '')}`;
	}

	/** Encodes a tag as a valid component of a URI. */
	public static encodeTag(tag: string) {
		return encodeURIComponent(this.formatTag(tag));
	}

	public static isValidTag(tag: string) {
		return /^#?[0289PYLQGRJCUV]{3,}$/.test(tag);
	}

	/**
	 * Encode tag string into 64bit unsigned integer string.
	 * ```ts
	 * Util.encodeTagToId('#PCCVQQG0'); // '510915076'
	 * ```
	 */
	public static encodeTagToId(tag: string) {
		const formatted = this.formatTag(tag).substring(1);
		if (!this.isValidTag(formatted)) {
			throw new Error(`Failed to encode tag ${formatted}. RegExp matching failed.`);
		}

		const result = formatted.split('').reduce((sum, char) => sum * 14n + BigInt(TAG_CHARACTERS.indexOf(char)), 0n);
		return result.toString();
	}

	/**
	 * Decode 64bit unsigned integer string into tag string with hash.
	 * ```ts
	 * Util.decodeTagToId('510915076'); // '#PCCVQQG0'
	 * ```
	 */
	public static decodeIdToTag(id: string) {
		let [bigint, tag] = [BigInt(id), ''];
		while (bigint !== 0n) {
			const index = Number(bigint % 14n);
			tag = TAG_CHARACTERS[index] + tag;
			bigint /= 14n;
		}

		return `#${tag}`;
	}

	/** Converts API Date to JavaScript Date. */
	public static formatDate(date: string) {
		const YYYY_MM_DD = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
		const HH_MM_SS = `${date.slice(9, 11)}:${date.slice(11, 13)}:${date.slice(13)}`;
		return new Date(`${YYYY_MM_DD}T${HH_MM_SS}`);
	}

	/** Returns a string containing a query string suitable for use in a URL. */
	public static queryString(options = {}) {
		const query = new URLSearchParams(options);
		for (const key of ['cache', 'force', 'retryLimit', 'ignoreRateLimit', 'restRequestTimeout']) query.delete(key);
		return query.toString();
	}

	private static getSeasonEnd(month: number, autoFix = true): Date {
		const now = new Date();
		now.setUTCMonth(month, 0);
		now.setUTCHours(5, 0, 0, 0);

		const newDate = now.getUTCDay() === 0 ? now.getUTCDate() - 6 : now.getUTCDate() - (now.getUTCDay() - 1);
		now.setUTCDate(newDate);

		if (Date.now() >= now.getTime() && autoFix) {
			return this.getSeasonEnd(month + 1);
		}

		return now;
	}

	/** Get current trophy season Id. */
	public static getSeasonId() {
		return this.getSeasonEndTime().toISOString().substring(0, 7);
	}

	/** Get current trophy season end date. */
	public static getSeasonEndTime(date = new Date()) {
		return this.getSeasonEnd(date.getUTCMonth() + 1);
	}

	public static async allSettled<T>(values: Promise<T>[]) {
		return (await Promise.allSettled(values))
			.filter((res) => res.status === 'fulfilled')
			.map((res) => (res as PromiseFulfilledResult<T>).value);
	}

	public static async delay(ms: number) {
		return new Promise((res) => setTimeout(res, ms));
	}
}
