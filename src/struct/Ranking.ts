import { Client } from '../client/Client';
import { APIClanBuilderBaseRanking, APIClanRanking, APIPlayerBuilderBaseRanking, APIPlayerRanking } from '../types';
import { UnrankedLeagueData } from '../util/Constants';
import { Badge } from './Badge';
import { League } from './League';
import { Location } from './Location';
import { PlayerClan } from './PlayerClan';

/** Represents the Player of seasonal legend league leader-board ranking. */
export class SeasonRankedPlayer {
	/** The player's name. */
	public name: string;

	/** The player's tag. */
	public tag: string;

	/** The player's experience level. */
	public expLevel: number;

	/** The player's trophy count. */
	public trophies: number;

	/** The player's attack wins. */
	public attackWins: number;

	/** The player's defense wins. */
	public defenseWins: number;

	/** The player's rank in the clan leader-board. */
	public rank: number;

	/** The player's clan. */
	public clan: PlayerClan | null;

	public constructor(client: Client, data: Omit<APIPlayerRanking, 'league'>) {
		this.name = data.name;
		this.tag = data.tag;
		this.rank = data.rank;
		this.expLevel = data.expLevel;
		this.trophies = data.trophies;
		this.attackWins = data.attackWins;
		this.defenseWins = data.defenseWins;
		// @ts-expect-error
		this.clan = data.clan ? new PlayerClan(client, data.clan) : null;
	}

	/** Get player's formatted link to open player in-game. */
	public get shareLink() {
		return `https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${this.tag.replace(/#/g, '')}`;
	}
}

/** Represents the Player of location based leader-board ranking. */
export class RankedPlayer {
	/** The player's name. */
	public name: string;

	/** The player's tag. */
	public tag: string;

	/** The player's experience level. */
	public expLevel: number;

	/** The player's trophy count. If retrieving info for builder base leader-boards, this will be `null`. */
	public trophies: number | null;

	/** The player's attack wins. If retrieving info for builder base leader-boards, this will be `null`. */
	public attackWins: number | null;

	/** The player's defense wins. If retrieving info for builder base leader-boards, this will be `null`. */
	public defenseWins: number | null;

	/** The player's builder base trophy count. If retrieving info for regular leader-boards, this will be `null`. */
	public builderBaseTrophies: number | null;

	/** @deprecated */
	public versusBattleWins: number | null;

	/** @deprecated */
	public versusTrophies?: number | null;

	/** The player's rank in the clan leader-board. */
	public rank: number;

	/** The player's rank before the last leader-board change. If retrieving info for legend league season, this will be `null`.  */
	public previousRank: number | null;

	/** The player's clan. */
	public clan: PlayerClan | null;

	/** The player's league. If retrieving info for builder base leader-boards, this will be `null`. */
	public league!: League | null;

	public constructor(client: Client, data: APIPlayerRanking | APIPlayerBuilderBaseRanking) {
		this.name = data.name;
		this.tag = data.tag;
		this.expLevel = data.expLevel;
		// @ts-expect-error
		this.trophies = data.trophies ?? null;
		// @ts-expect-error
		this.attackWins = data.attackWins ?? null;
		// @ts-expect-error
		this.defenseWins = data.defenseWins ?? null;
		// @ts-expect-error
		this.builderBaseTrophies = data.builderBaseTrophies ?? null;
		// @ts-expect-error
		this.versusBattleWins = data.versusBattleWins ?? null;
		// @ts-expect-error
		this.versusTrophies = data.versusTrophies ?? null;
		this.rank = data.rank;
		this.previousRank = data.previousRank ?? null; // eslint-disable-line
		// @ts-expect-error
		this.clan = data.clan ? new PlayerClan(client, data.clan) : null;
		// @ts-expect-error
		this.league = data.trophies ? new League(data.league ?? UnrankedLeagueData) : null; // eslint-disable-line
	}

	/** Get player's formatted link to open player in-game. */
	public get shareLink() {
		return `https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${this.tag.replace(/#/g, '')}`;
	}
}

/** Represents the Clan of location based leader-board ranking. */
export class RankedClan {
	/** The clan's name. */
	public name: string;

	/** The clan's tag. */
	public tag: string;

	/** The clan's level. */
	public level: number;

	/** The clan's trophy count. If retrieving info for builder base leader-boards, this will be `null`.  */
	public points: number | null;

	/** The clan's builder base trophy count. If retrieving info for regular leader boards, this will be `null`. */
	public builderBasePoints: number | null;

	/** @deprecated */
	public versusPoints?: number | null;

	/** The clan's location. */
	public location: Location;

	/** The number of members in the clan. */
	public memberCount: number;

	/** The clan's rank in the leader board. */
	public rank: number;

	/** The clan's rank in the previous season's leader-board. */
	public previousRank: number;

	/** The clan's badge. */
	public badge: Badge;

	public constructor(data: APIClanRanking | APIClanBuilderBaseRanking) {
		this.name = data.name;
		this.tag = data.tag;
		this.level = data.clanLevel;
		// @ts-expect-error
		this.points = data.clanPoints ?? null;
		// @ts-expect-error
		this.builderBasePoints = data.clanBuilderBasePoints ?? null;
		// @ts-expect-error
		this.versusPoints = data.clanVersusPoints ?? null;
		this.location = new Location(data.location);
		this.memberCount = data.members;
		this.rank = data.rank;
		this.previousRank = data.previousRank;
		this.badge = new Badge(data.badgeUrls);
	}

	/** Get clan's formatted link to open clan in-game. */
	public get shareLink() {
		return `https://link.clashofclans.com/en?action=OpenClanProfile&tag=${this.tag.replace(/#/g, '')}`;
	}
}
