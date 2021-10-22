import { APIClanWarLogEntry, APIWarClan } from '../types';
import { Client } from '../client/Client';
import Util from '../util/Util';
import { Badge } from './Badge';

export class WarLogClan {
	/** The clan's name. */
	public name: string;

	/** The clan's tag. */
	public tag: string;

	/** The clan's badge. */
	public badge: Badge;

	/** The clan's level. */
	public level: number;

	/** Number of stars achieved by this clan. */
	public stars: number;

	/** The destruction achieved as a percentage. */
	public destruction: number;

	/**
	 * Total XP earned by clan this war.
	 * This property is `null` for the opponent.
	 */
	public expEarned: number | null;

	/**
	 * Total attacks used by this clan.
	 * This property is `null` for the opponent.
	 */
	public attacksUsed: number | null;

	public constructor(data: APIWarClan) {
		this.name = data.name;
		this.tag = data.tag;
		this.badge = new Badge(data.badgeUrls);
		this.level = data.clanLevel;
		this.stars = data.stars;
		this.attacksUsed = data.attacks || null;
		this.destruction = data.destructionPercentage;
		this.expEarned = data.expEarned ?? null;
	}
}

export class ClanWarLog {
	/** The result of the war. */
	public result: 'win' | 'lose' | 'tie' | null;

	/** The Date that battle day ends at. */
	public endTime: Date;

	/** The number of players on each side. */
	public teamSize: number;

	/** The number of attacks each member has. */
	public attacksPerMember: number | null;

	/** The home clan. */
	public clan: WarLogClan;

	/**
	 * The opposition clan.
	 * This property is `null` CWL entries.
	 */
	public opponent: WarLogClan | null;

	public constructor(public client: Client, data: APIClanWarLogEntry) {
		this.result = data.result;
		this.endTime = Util.parseDate(data.endTime);
		this.teamSize = data.teamSize;
		this.attacksPerMember = data.attacksPerMember ?? null;

		// @ts-expect-error
		this.clan = new WarLogClan(data.clan);
		// @ts-expect-error
		this.opponent = data.opponent.tag ? new WarLogClan(data.opponent) : null; // eslint-disable-line
	}

	/** Returns either `friendly`, `cwl` or `regular`. */
	public get type() {
		if (!this.clan.expEarned) return 'friendly';
		if (!this.opponent) return 'cwl';
		return 'regular';
	}
}
