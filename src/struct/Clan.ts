import { APIClan, OverrideOptions } from '../types';
import { ChatLanguage } from './ChatLanguage';
import { ClanMember } from './ClanMember';
import { Client } from '../client/Client';
import { WarLeague } from './WarLeague';
import type { Player } from './Player';
import { Location } from './Location';
import { Label } from './Label';
import { Badge } from './Badge';

/** Represents a Clan. */
export class Clan {
	/** Name of the clan. */
	public name: string;

	/** Tag of the clan. */
	public tag: string;

	/** The clan's type for accepting members. */
	public type: 'open' | 'inviteOnly' | 'closed';

	/** The clan's description. */
	public description: string;

	/** The location of this clan. */
	public location: Location | null;

	/** The clan's trophy count. */
	public chatLanguage: ChatLanguage | null;

	/** The clan's Badge. */
	public badge: Badge;

	/** The clan's level. */
	public level: number;

	/** The clan's trophy count. */
	public points: number;

	/** The clan's versus trophy count. */
	public versusPoints: number;

	/** The minimum trophies required to apply to this clan. */
	public requiredTrophies: number;

	/** The minimum hall level required to apply to this clan. */
	public requiredTownHallLevel: number | null;

	/** The frequency for when this clan goes to war. */
	public warFrequency: 'always' | 'moreThanOncePerWeek' | 'oncePerWeek' | 'lessThanOncePerWeek' | 'never' | 'unknown';

	/** The clan's current war winning streak. */
	public warWinStreak: number;

	/** The number of wars the clan has won. */
	public warWins: number;

	/** The number of wars the clan has tied. */
	public warTies: number | null;

	/** The number of wars the clan has lost. */
	public warLosses: number | null;

	/** Indicates if the clan has a public war log. */
	public isWarLogPublic: boolean;

	/** The clan's CWL league. */
	public warLeague: WarLeague | null;

	/** The number of members in the clan. */
	public memberCount: number;

	/** An array of {@link Label} that the clan has. */
	public labels: Label[];

	/**
	 * List of clan members.
	 * - This property returns empty array for {@link Client.getClans} method.
	 */
	public members: ClanMember[];

	public constructor(public client: Client, data: APIClan) {
		this.name = data.name;
		this.tag = data.tag;
		this.type = data.type;
		this.description = data.description;
		this.location = data.location ? new Location(data.location) : null;
		this.chatLanguage = data.chatLanguage ? new ChatLanguage(data.chatLanguage) : null;
		this.badge = new Badge(data.badgeUrls);
		this.level = data.clanLevel;
		this.points = data.clanPoints;
		this.versusPoints = data.clanVersusPoints;
		this.requiredTrophies = data.requiredTrophies;
		this.requiredTownHallLevel = data.requiredTownhallLevel ?? null;
		this.warFrequency = data.warFrequency;
		this.warWinStreak = data.warWinStreak;
		this.warWins = data.warWins;
		this.warTies = data.warTies ?? null;
		this.warLosses = data.warLosses ?? null;
		this.isWarLogPublic = data.isWarLogPublic;
		this.warLeague = data.warLeague ? new WarLeague(data.warLeague) : null;
		this.memberCount = data.members;
		this.labels = data.labels.map((label) => new Label(label));
		this.members = data.memberList?.map((mem) => new ClanMember(this.client, mem)) ?? []; // eslint-disable-line
	}

	/** Get {@link Player} info for every Player in the clan. */
	public async fetchMembers(options?: OverrideOptions) {
		return (await Promise.allSettled(this.members.map((m) => this.client.getPlayer(m.tag, { ...options, ignoreRateLimit: true }))))
			.filter((res) => res.status === 'fulfilled')
			.map((res) => (res as PromiseFulfilledResult<Player>).value);
	}
}
