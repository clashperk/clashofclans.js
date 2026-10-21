import { CalendarMonth, ClanSearchOptions, LeagueSeason, SearchOptions } from '../types';

const TAG_CHARACTERS = '0289PYLQGRJCUV' as const;

const LEAGUE_SEASON_DURATION = 28 * 24 * 60 * 60 * 1000;
// 28-day seasons count from here; before it ran a one-off 6-week transition season.
const LEAGUE_SEASON_ANCHOR = Date.UTC(2025, 9, 6, 5);
const LEAGUE_SEASON_TRANSITION_START = Date.UTC(2025, 7, 25, 5);

const params = [
	'name',
	'minMembers',
	'maxMembers',
	'minClanPoints',
	'minClanLevel',
	'warFrequency',
	'locationId',
	'labelIds',
	'limit',
	'after',
	'before',
	'playerTag'
];

export function timeoutSignal(timeout: number) {
	if (!Number.isInteger(timeout)) {
		throw new TypeError('Expected an integer for the timeout');
	}

	const controller = new AbortController();

	if (timeout > 0) {
		const timeoutId = setTimeout(() => {
			controller.abort();
		}, timeout);
		timeoutId.unref();
	}

	return controller.signal;
}

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
		if (tag && typeof tag === 'string') {
			return `#${tag.toUpperCase().replace(/O/g, '0').replace(/^#/g, '').replace(/\s/g, '')}`;
		}
		throw new TypeError('The "tag" argument must be of type string.');
	}

	/** Encodes a tag as a valid component of a URI. */
	public static encodeURI(tag: string) {
		return encodeURIComponent(this.formatTag(tag));
	}

	/** Verify a tag using RegExp. (`/^#?[0289PYLQGRJCUV]$/`) */
	public static isValidTag(tag: string) {
		return /^#?[0289PYLQGRJCUV]{3,}$/.test(tag);
	}

	/**
	 * Encode tag string into 64bit unsigned integer string.
	 * ```ts
	 * Util.encodeTag('#PCCVQQG0'); // '510915076'
	 * ```
	 */
	public static encodeTag(tag: string) {
		const formatted = this.formatTag(tag).slice(1);
		if (!this.isValidTag(formatted)) {
			throw new TypeError(`Failed to encode tag ${formatted}. RegExp matching failed.`);
		}

		const result = formatted.split('').reduce((sum, char) => sum * BigInt(14) + BigInt(TAG_CHARACTERS.indexOf(char)), BigInt(0));
		return result.toString();
	}

	/**
	 * Decode 64bit unsigned integer string into tag string with hash.
	 * ```ts
	 * Util.decodeTag('510915076'); // '#PCCVQQG0'
	 * ```
	 */
	public static decodeTag(id: string) {
		let [bigint, tag] = [BigInt(id), ''];
		while (bigint !== BigInt(0)) {
			const index = Number(bigint % BigInt(14));
			tag = TAG_CHARACTERS[index] + tag;
			bigint /= BigInt(14);
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
	public static queryString(options: SearchOptions | ClanSearchOptions = {}) {
		const query = new URLSearchParams(Object.entries(options).filter(([key]) => params.includes(key))).toString();
		return query.length ? `?${query}` : query;
	}

	/** @deprecated Use getLeagueSeason instead */
	public static getSeasonStart(inputDate: Date) {
		const lastMonthLastDay = new Date(Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), 0));
		const lastMonthLastMonday = new Date(lastMonthLastDay);
		lastMonthLastMonday.setUTCDate(lastMonthLastMonday.getUTCDate() - ((lastMonthLastDay.getUTCDay() + 6) % 7));
		lastMonthLastMonday.setUTCHours(5, 0, 0, 0);

		return lastMonthLastMonday;
	}

	/** @deprecated Use getLeagueSeason instead */
	public static getSeasonEnd(inputDate: Date, forward = true): Date {
		const lastDayOfMonth = new Date(Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth() + 1, 0));
		const lastMonday = new Date(lastDayOfMonth);
		lastMonday.setUTCDate(lastMonday.getUTCDate() - ((lastDayOfMonth.getUTCDay() + 6) % 7));

		lastMonday.setUTCHours(5, 0, 0, 0);

		// check if the last Monday is in the past relative to the input date
		if (lastMonday.getTime() < inputDate.getTime() && forward) {
			// calculate the last Monday of the next month
			const nextMonth = new Date(Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth() + 1, 1));
			const nextMonthLastDay = new Date(Date.UTC(nextMonth.getUTCFullYear(), nextMonth.getUTCMonth() + 1, 0));
			const nextMonthLastMonday = new Date(nextMonthLastDay);
			nextMonthLastMonday.setUTCDate(nextMonthLastMonday.getUTCDate() - ((nextMonthLastDay.getUTCDay() + 6) % 7));

			nextMonthLastMonday.setUTCHours(5, 0, 0, 0);

			return nextMonthLastMonday;
		}

		return lastMonday;
	}

	/** @deprecated Use getLeagueSeason or getMonth instead. The id drifts ahead of the calendar month. */
	public static getSeasonId() {
		return this.getSeason(new Date()).seasonId;
	}

	/**
	 * @deprecated Use getLeagueSeason or getMonth instead. The id drifts ahead of the calendar month.
	 *
	 * Get the season start and end timestamp.
	 * @param {Date} timestamp - The reference date. Defaults to the current date if not provided.
	 * @param {boolean} forward - Whether to forward to the next month if the returned date is in the past relative to the given timestamp. Defaults to true.
	 */
	public static getSeason(timestamp?: Date, forward: boolean = true) {
		const target = timestamp ?? new Date();

		if (target <= new Date('2025-08-25T05:00:00.000Z')) {
			const endTime = this.getSeasonEnd(timestamp ?? new Date(), forward);
			const startTime = this.getSeasonStart(endTime);
			return { endTime, startTime, seasonId: endTime.toISOString().slice(0, 7) };
		}

		if (target > new Date('2025-08-25T05:00:00.000Z') && target <= new Date('2025-10-06T05:00:00.000Z')) {
			return {
				startTime: new Date('2025-08-25T05:00:00.000Z'),
				endTime: new Date('2025-10-06T05:00:00.000Z'),
				seasonId: '2025-09'
			};
		}

		// After 6th October 2025, season ends every 4 weeks
		const seasonDuration = 7 * 4 * 24 * 60 * 60 * 1000;
		const referenceDate = new Date('2025-10-06T05:00:00.000Z');
		const timeDifference = target.getTime() - referenceDate.getTime();
		const seasonsPassed = Math.floor(timeDifference / seasonDuration);

		const startTime = new Date(referenceDate.getTime() + seasonsPassed * seasonDuration);
		const endTime = new Date(startTime.getTime() + seasonDuration);

		// "month" increments by 1 each season starting from referenceDate's month
		const refYear = referenceDate.getUTCFullYear();
		const refMonthIndex = referenceDate.getUTCMonth(); // 0-based (Oct -> 9)
		const totalMonths = refYear * 12 + refMonthIndex + seasonsPassed;

		const year = Math.floor(totalMonths / 12);
		const month = totalMonths - year * 12 + 1; // 1..12

		const seasonId = `${year}-${String(month).padStart(2, '0')}`;

		return { startTime, endTime, seasonId };
	}

	/** @deprecated Use getLeagueSeasonById or getMonthById instead. */
	public static getSeasonById(seasonId: string) {
		// Handle the fixed September 2025 season
		if (seasonId === '2025-09') {
			return {
				startTime: new Date('2025-08-25T05:00:00.000Z'),
				endTime: new Date('2025-10-06T05:00:00.000Z'),
				seasonId
			};
		}
		const date = new Date(seasonId);
		const targetYear = date.getUTCFullYear();
		const targetMonth = date.getUTCMonth() + 1; // 1..12

		const referenceDate = new Date('2025-10-06T05:00:00.000Z');

		// Only handle the post-6 Oct seasons with 28-day intervals
		const refYear = referenceDate.getUTCFullYear();
		const refMonthIndex = referenceDate.getUTCMonth(); // 0-based

		const totalMonthsTarget = targetYear * 12 + (targetMonth - 1);
		const totalMonthsRef = refYear * 12 + refMonthIndex;
		const seasonsPassed = totalMonthsTarget - totalMonthsRef;

		if (seasonsPassed < 0) {
			// Before 6th Oct, compute using old last-Monday rule
			const tempDate = new Date(Date.UTC(targetYear, targetMonth, 0)); // last day of month
			const lastMonday = new Date(tempDate);
			lastMonday.setUTCDate(lastMonday.getUTCDate() - ((tempDate.getUTCDay() + 6) % 7));
			lastMonday.setUTCHours(5, 0, 0, 0);

			const startTime = this.getSeasonStart(lastMonday);
			const endTime = lastMonday;

			return { startTime, endTime, seasonId };
		}

		// After 6 Oct 2025, 28-day seasons
		const seasonDuration = 28 * 24 * 60 * 60 * 1000;
		const startTime = new Date(referenceDate.getTime() + seasonsPassed * seasonDuration);
		const endTime = new Date(startTime.getTime() + seasonDuration);

		return { startTime, endTime, seasonId };
	}

	/** Get the 28-day trophy league season that contains the given time (defaults to now). */
	public static getLeagueSeason(timestamp: Date = new Date()): LeagueSeason {
		const time = timestamp.getTime();

		if (time >= LEAGUE_SEASON_ANCHOR) {
			const seasonsPassed = Math.floor((time - LEAGUE_SEASON_ANCHOR) / LEAGUE_SEASON_DURATION);
			const startTime = new Date(LEAGUE_SEASON_ANCHOR + seasonsPassed * LEAGUE_SEASON_DURATION);
			return this.toLeagueSeason(startTime, new Date(startTime.getTime() + LEAGUE_SEASON_DURATION));
		}

		if (time >= LEAGUE_SEASON_TRANSITION_START) {
			return this.toLeagueSeason(new Date(LEAGUE_SEASON_TRANSITION_START), new Date(LEAGUE_SEASON_ANCHOR));
		}

		// Before the transition, seasons ended on the last Monday of the month; the end instant belongs to the next season.
		let endTime = this.getSeasonEnd(timestamp);
		if (endTime.getTime() === time) endTime = this.getSeasonEnd(new Date(time + 1));
		return this.toLeagueSeason(this.getSeasonStart(endTime), endTime);
	}

	/**
	 * Get a trophy league season by its start date (`YYYY-MM-DD`).
	 * Also accepts the legacy `YYYY-MM` ids returned by {@link Util.getSeason}.
	 */
	public static getLeagueSeasonById(id: string): LeagueSeason {
		if (/^\d{4}-\d{2}$/.test(id)) return this.getLeagueSeason(this.getSeasonById(id).startTime);
		return this.getLeagueSeason(new Date(`${id}T05:00:00.000Z`));
	}

	/** Get the latest `count` trophy league seasons, newest first, ending with the one that contains `timestamp`. */
	public static getLeagueSeasons(count: number, timestamp: Date = new Date()): LeagueSeason[] {
		const seasons = [this.getLeagueSeason(timestamp)];
		while (seasons.length < count) {
			seasons.push(this.getLeagueSeason(new Date(seasons[seasons.length - 1].startTime.getTime() - 1)));
		}
		return seasons;
	}

	/** Get the UTC calendar month that contains the given time (defaults to now). */
	public static getMonth(timestamp: Date = new Date()): CalendarMonth {
		const startTime = new Date(Date.UTC(timestamp.getUTCFullYear(), timestamp.getUTCMonth(), 1));
		const endTime = new Date(Date.UTC(timestamp.getUTCFullYear(), timestamp.getUTCMonth() + 1, 1));
		return { id: startTime.toISOString().slice(0, 7), startTime, endTime };
	}

	/** Get a UTC calendar month by its id (`YYYY-MM`). */
	public static getMonthById(id: string): CalendarMonth {
		return this.getMonth(new Date(`${id}-01T00:00:00.000Z`));
	}

	/** Get the latest `count` UTC calendar months, newest first, ending with the one that contains `timestamp`. */
	public static getMonths(count: number, timestamp: Date = new Date()): CalendarMonth[] {
		const months = [this.getMonth(timestamp)];
		while (months.length < count) {
			months.push(this.getMonth(new Date(months[months.length - 1].startTime.getTime() - 1)));
		}
		return months;
	}

	private static toLeagueSeason(startTime: Date, endTime: Date): LeagueSeason {
		return { id: startTime.toISOString().slice(0, 10), startTime, endTime };
	}

	public static getTournamentWindow(timestamp?: Date) {
		const now = timestamp ?? new Date();

		const day = now.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
		const hour = now.getUTCHours();

		// Days since last Monday
		let daysSinceMonday = (day + 6) % 7; // e.g., if Mon -> 0, Tue -> 1, etc.

		// If today is Monday but before 5 AM, move back one full week
		if (day === 1 && hour < 5) {
			daysSinceMonday = 7;
		}

		// Last Monday 5:00 AM UTC
		const lastMonday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysSinceMonday, 5, 0, 0, 0));

		// Next Monday 5:00 AM UTC (7 days after last Monday)
		const nextMonday = new Date(
			Date.UTC(lastMonday.getUTCFullYear(), lastMonday.getUTCMonth(), lastMonday.getUTCDate() + 7, 5, 0, 0, 0)
		);

		const year = lastMonday.getUTCFullYear();
		const month = String(lastMonday.getUTCMonth() + 1).padStart(2, '0');
		const dayOfMonth = String(lastMonday.getUTCDate()).padStart(2, '0');

		return {
			id: `${year}-${month}-${dayOfMonth}`,
			startTime: lastMonday,
			endTime: nextMonday
		};
	}

	public static getTournamentWindowById(id: string) {
		return this.getTournamentWindow(new Date(`${id}T05:00:00.000Z`));
	}

	public static async allSettled<T>(values: Promise<T>[]) {
		return (await Promise.allSettled(values))
			.filter((res) => res.status === 'fulfilled')
			.map((res) => (res as PromiseFulfilledResult<T>).value);
	}

	public static calculateTrophies(stars: number, destruction: number, isAttack: boolean, isLegendLeague: boolean): number {
		let attackerGain = 0;

		if (stars === 3) {
			// 3 stars always awards the full pool
			attackerGain = 40;
		} else if (stars === 2) {
			// 16 base + 1 per 3% over 50%
			attackerGain = 16 + Math.floor((destruction - 50) / 3);
		} else if (stars === 1) {
			// 5 base + 1 per 9% destruction
			attackerGain = 5 + Math.floor(destruction / 9);
		} else {
			// 0 stars: 1 trophy per 10% destruction (minimum 10% required)
			if (destruction >= 10) {
				attackerGain = Math.floor(destruction / 10);
			}
		}

		// Cap at 40 (standard trophy pool)
		if (attackerGain > 40) {
			attackerGain = 40;
		}

		if (isAttack) {
			return attackerGain;
		}

		// In Legend League, the defender LOSES what the attacker gains
		if (isLegendLeague) {
			return -attackerGain;
		}

		// In Ranked, the defender GAINS the remainder of the 40 pool
		// 0-star defense always gives full 40 to defender
		if (stars === 0) {
			return 40;
		}

		return 40 - attackerGain;
	}

	public static async delay(ms: number) {
		return new Promise((res) => setTimeout(res, ms));
	}
}
