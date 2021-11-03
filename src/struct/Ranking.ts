import { APIClanRanking, APIClanVersusRanking, APIPlayerRanking, APIPlayerVersusRanking } from '../types';
import { UNRANKED_LEAGUE_DATA } from '../util/Constants';
import { PlayerClan } from './PlayerClan';
import { Client } from '../client/Client';
import { Location } from './Location';
import { League } from './League';
import { Badge } from './Badge';

/** Represents the player of leader-board ranking. */
export class RankedPlayer {
	/** The player's name. */
	public name: string;

	/** The player's tag. */
	public tag: string;

	/** The player's experience level. */
	public expLevel: number;

	/** The player's trophy count. If retrieving info for versus leader-boards, this will be `null`. */
	public trophies: number | null;

	/** The player's attack wins. If retrieving info for versus leader-boards, this will be `null`. */
	public attackWins: number | null;

	/** The player's defense wins. If retrieving info for versus leader-boards, this will be `null`. */
	public defenseWins: number | null;

	/** The player's versus trophy count. If retrieving info for regular leader-boards, this will be `null`. */
	public versusTrophies: number | null;

	/** The number of total versus attacks the player has won. If retrieving info for regular leader-boards, this will be `null`. */
	public versusBattleWins: number | null;

	/** The player's rank in the clan leader-board. */
	public rank: number;

	/** The player's rank before the last leader-board change. */
	public previousRank: number;

	/** The player's clan. */
	public clan: PlayerClan;

	/** The player's league. If retrieving info for versus leader-boards, this will be `null`. */
	public league!: League | null;

	public constructor(client: Client, data: APIPlayerRanking | APIPlayerVersusRanking) {
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
		this.versusTrophies = data.versusTrophies ?? null;
		// @ts-expect-error
		this.versusBattleWins = data.versusBattleWins ?? null;
		this.rank = data.rank;
		this.previousRank = data.previousRank;
		this.clan = new PlayerClan(client, data.clan);
		// @ts-expect-error
		this.league = data.trophies ? new League(data.league ?? UNRANKED_LEAGUE_DATA) : null; // eslint-disable-line
	}
}

/** Represents the clan of leader-board ranking. */
export class RankedClan {
	/** The clan's name. */
	public name: string;

	/** The clan's tag. */
	public tag: string;

	/** The clan's level. */
	public level: number;

	/** The clan's trophy count. If retrieving info for versus leader-boards, this will be `null`.  */
	public points: number | null;

	/** The clan's versus trophy count. If retrieving info for regular leader boards, this will be `null`. */
	public versusPoints: number | null;

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

	public constructor(data: APIClanRanking | APIClanVersusRanking) {
		this.name = data.name;
		this.tag = data.tag;
		this.level = data.clanLevel;
		// @ts-expect-error
		this.points = data.clanPoints ?? null;
		// @ts-expect-error
		this.versusPoints = data.clanVersusPoints ?? null;
		this.location = new Location(data.location);
		this.memberCount = data.members;
		this.rank = data.rank;
		this.previousRank = data.previousRank;
		this.badge = new Badge(data.badgeUrls);
	}
}
