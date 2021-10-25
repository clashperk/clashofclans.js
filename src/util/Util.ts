/** Contains various general-purpose utility methods. */
export class Util extends null {
	/** Encode a game tag. */
	public static encodeTag(tag: string) {
		return encodeURIComponent(this.parseTag(tag));
	}

	/** Parse a game tag. */
	public static parseTag(tag: string) {
		return `#${tag.toUpperCase().replace(/O|o/g, '0').replace(/^#/g, '')}`;
	}

	/** Parse API Date to JavaScript Date. */
	public static parseDate(time: string) {
		return new Date(
			`${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)}T${time.slice(9, 11)}:${time.slice(11, 13)}:${time.slice(13)}`
		);
	}

	/** Get URL search params. */
	public static queryString(options = {}) {
		const query = new URLSearchParams(options);
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

	/** Get current trophy season end time. */
	public static getSeasonEndTime(date = new Date()) {
		return this.getSeasonEnd(date.getUTCMonth() + 1);
	}

	public static async allSettled<T>(values: Promise<T>[]) {
		return (await Promise.allSettled(values))
			.filter((res) => res.status === 'fulfilled')
			.map((res) => (res as PromiseFulfilledResult<T>).value);
	}
}
