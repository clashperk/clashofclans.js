import { APIClanRanking, APIClanVersusRanking, APIPlayerRanking, APIPlayerVersusRanking } from '../types';
import { PlayerClan } from './PlayerClan';
import { Location } from './Location';
import { League } from './League';
import { Badge } from './Badge';

export class RankedPlayer {
	public tag: string;
	public name: string;
	public expLevel: number;
	public trophies: number | null;
	public attackWins: number | null;
	public defenseWins: number | null;
	public rank: number;
	public clan: PlayerClan;
	public league!: League | null;
	public versusTrophies: number | null;
	public versusBattleWins: number | null;

	public constructor(data: APIPlayerRanking | APIPlayerVersusRanking) {
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
		this.clan = new PlayerClan(data.clan);
		// @ts-expect-error
		this.league = data.league ? new League(data.league) : null; // eslint-disable-line
	}
}

export class RankedClan {
	public name: string;
	public tag: string;
	public clanLevel: number;
	public clanPoints: number | null;
	public clanVersusPoints: number | null;
	public location: Location;
	public members: number;
	public rank: number;
	public previousRank: number;
	public badge: Badge;

	public constructor(data: APIClanRanking | APIClanVersusRanking) {
		this.name = data.name;
		this.tag = data.tag;
		this.clanLevel = data.clanLevel;
		// @ts-expect-error
		this.clanPoints = data.clanPoints ?? null;
		// @ts-expect-error
		this.clanVersusPoints = data.clanVersusPoints ?? null;
		this.location = new Location(data.location);
		this.members = data.members;
		this.rank = data.rank;
		this.previousRank = data.previousRank;
		this.badge = new Badge(data.badgeUrls);
	}
}
