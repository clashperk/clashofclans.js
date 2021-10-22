import { APIClanWarLeagueClan, APIClanWarLeagueClanMember, APIClanWarLeagueGroup, APIClanWarLeagueRound } from '../types';
import { Client } from '../client/Client';
import { ClanWar } from './ClanWar';
import { Player } from './Player';
import { Badge } from './Badge';

/** Represents a Clan War League member.  */
export class ClanWarLeagueClanMember {
	/** The member's name. */
	public name: string;

	/** The member's tag. */
	public tag: string;

	/** The member's town hall level. */
	public townHallLevel: number;

	public constructor(data: APIClanWarLeagueClanMember) {
		this.name = data.name;
		this.tag = data.tag;
		this.townHallLevel = data.townHallLevel;
	}
}

/** Represents a Clan of CWL Group. */
export class ClanWarLeagueClan {
	/** The clan's name. */
	public name: string;

	/** The clan's tag. */
	public tag: string;

	/** The clan's level. */
	public level: number;

	/** The clan's badge. */
	public badge: Badge;

	/** An array of members that are in the CWL group. */
	public members: ClanWarLeagueClanMember[];

	public constructor(private readonly client: Client, data: APIClanWarLeagueClan) {
		this.name = data.name;
		this.tag = data.tag;
		this.level = data.clanLevel;
		this.badge = new Badge(data.badgeUrls);
		this.members = data.members.map((mem) => new ClanWarLeagueClanMember(mem));
	}

	/** Get {@link Player} information for every members that are in the CWL group. */
	public async fetchMembers() {
		return (await Promise.allSettled(this.members.map((m) => this.client.getPlayer(m.tag, { ignoreRateLimit: true }))))
			.filter((res) => res.status === 'fulfilled')
			.map((res) => (res as PromiseFulfilledResult<Player>).value);
	}
}

/** Represents a Round of CWL Group. */
export class ClanWarLeagueRound {
	/** War Tags for this round. */
	public warTags: string[];

	/** The # of this round. */
	public round: number;

	public constructor(data: APIClanWarLeagueRound, round: number) {
		this.warTags = data.warTags;
		this.round = round + 1;
	}
}

/** Represents a CWL Group. */
export class ClanWarLeagueGroup {
	/** The CWL group's current war state. */
	public state: 'preparation' | 'inWar' | 'warEnded';

	/** Season Id of this CWL group. */
	public season: string;

	/** Returns all participating clans. */
	public clans: ClanWarLeagueClan[];

	/** An array containing all war tags for each round. */
	public rounds: ClanWarLeagueRound[];

	public constructor(private readonly client: Client, data: APIClanWarLeagueGroup) {
		this.state = data.state;
		this.season = data.season;
		this.clans = data.clans.map((clan) => new ClanWarLeagueClan(client, clan));
		this.rounds = data.rounds.map((round, i) => new ClanWarLeagueRound(round, i));
	}

	/**
	 * This returns an array of {@link ClanWar} which fetches all wars in parallel.
	 * @param clanTag Optional clan tag. If present, this will only return wars which belong to this clan.
	 */
	public async getWars(clanTag?: string) {
		const rounds = this.rounds.filter((round) => !round.warTags.includes('#0'));
		if (!rounds.length) return [];

		const warTags = rounds.map((round) => round.warTags).flat();
		const wars = await Promise.allSettled(
			warTags.map((warTag) => this.client.getClanWarLeagueRound({ warTag, clanTag }, { ignoreRateLimit: true }))
		);
		return wars
			.filter((res) => res.status === 'fulfilled' && res.value)
			.map((res) => (res as PromiseFulfilledResult<ClanWar>).value)
			.filter((war) => (clanTag ? war.clan.tag === clanTag : true));
	}
}
