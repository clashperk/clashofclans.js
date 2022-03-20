import { APIClanWarLogEntry, APIWarLogClan } from '../types';
import { Client } from '../client/Client';
import { Util } from '../util/Util';
import { Badge } from './Badge';

/**
 * Represents War Log Clan.
 *
 * If this is called via {@link ClanWarLog.opponent}, then {@link WarLogClan.attackCount} and {@link WarLogClan.expEarned} will be `null`.
 * For CWL entries {@link WarLogClan.name} and {@link WarLogClan.tag} are `null`.
 */
export class WarLogClan {
	/** The clan's name. This property is `null` CWL entries. */
	public name: string | null;

	/** The clan's tag. This property is `null` CWL entries. */
	public tag: string | null;

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
	public attackCount: number | null;

	public constructor(data: APIWarLogClan) {
		this.name = data.name ?? null;
		this.tag = data.tag ?? null;
		this.badge = new Badge(data.badgeUrls);
		this.level = data.clanLevel;
		this.stars = data.stars;
		this.attackCount = data.attacks ?? null;
		this.destruction = data.destructionPercentage;
		this.expEarned = data.expEarned ?? null;
	}

	/** Get clan's formatted link to open clan in-game. */
	public get shareLink() {
		return this.tag && `https://link.clashofclans.com/en?action=OpenClanProfile&tag=${this.tag.replace(/#/g, '')}`;
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

	/** The opposition clan. */
	public opponent: WarLogClan;

	public constructor(public client: Client, data: APIClanWarLogEntry) {
		this.result = data.result ?? null;
		this.endTime = Util.formatDate(data.endTime);
		this.teamSize = data.teamSize;
		this.attacksPerMember = data.attacksPerMember ?? null;
		this.clan = new WarLogClan(data.clan);
		this.opponent = new WarLogClan(data.opponent);
	}

	/** Returns either `friendly`, `cwl` or `normal`. */
	public get type() {
		if (!this.clan.expEarned) return 'friendly';
		if (!this.opponent.tag) return 'cwl';
		return 'normal';
	}
}
