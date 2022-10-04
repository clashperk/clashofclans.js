import { ClanSearchOptions, SearchOptions } from '../types';
import { RawData } from '../util/Constants';

const TAG_CHARACTERS = '0289PYLQGRJCUV' as const;

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
	'before'
];

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
		const formatted = this.formatTag(tag).substring(1);
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

	private static getSeasonEnd(month: number, year: number, autoFix = true): Date {
		const now = new Date();
		now.setUTCFullYear(year);
		now.setUTCMonth(month, 0);
		now.setUTCHours(5, 0, 0, 0);

		const newDate = now.getUTCDay() === 0 ? now.getUTCDate() - 6 : now.getUTCDate() - (now.getUTCDay() - 1);
		now.setUTCDate(newDate);

		if (Date.now() >= now.getTime() && autoFix) {
			return this.getSeasonEnd(month + 1, year);
		}

		return now;
	}

	/** Get current trophy season Id. */
	public static getSeasonId() {
		return this.getSeasonEndTime().toISOString().substring(0, 7);
	}

	/** Get trophy season end timestamp. */
	public static getSeasonEndTime(timestamp?: Date) {
		const autoFix = !(timestamp instanceof Date);
		const date = timestamp instanceof Date ? timestamp : new Date();
		return this.getSeasonEnd(date.getUTCMonth() + 1, date.getUTCFullYear(), autoFix);
	}

	public static async allSettled<T>(values: Promise<T>[]) {
		return (await Promise.allSettled(values))
			.filter((res) => res.status === 'fulfilled')
			.map((res) => (res as PromiseFulfilledResult<T>).value);
	}

	public static async delay(ms: number) {
		return new Promise((res) => setTimeout(res, ms));
	}

	/** Parse in-game army link into troops and spells count with respective Id's. */
	public static parseArmyLink(link: string) {
		const unitsMatches = /u(?<units>[\d+x-]+)/.exec(link);
		const spellsMatches = /s(?<spells>[\d+x-]+)/.exec(link);

		const unitsPart = (unitsMatches?.groups?.unit as string | null)?.split('-') ?? [];
		const spellParts = (spellsMatches?.groups?.spells as string | null)?.split('-') ?? [];

		const units = unitsPart
			.map((parts) => parts.split(/x/))
			.map((parts) => ({
				id: Number(parts[1]),
				total: Number(parts[0])
			}));

		const spells = spellParts
			.map((parts) => parts.split(/x/))
			.map((parts) => ({
				id: Number(parts[1]),
				total: Number(parts[0])
			}));

		return {
			units: units.map((unit) => {
				const _unit = RawData.RawUnits.find((raw) => raw.category === 'troop' && raw.id === unit.id);
				return { name: _unit?.name ?? null, count: unit.total, id: unit.id };
			}),
			spells: spells.map((spell) => {
				const _spell = RawData.RawUnits.find((raw) => raw.category === 'spell' && raw.id === spell.id);
				return { name: _spell?.name ?? null, count: spell.total, id: spell.id };
			})
		};
	}
}
