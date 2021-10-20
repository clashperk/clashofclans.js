import { APIClanWarLeagueClan, APIClanWarLeagueClanMember, APIClanWarLeagueGroup, APIClanWarLeagueRound } from '../types';
import { Client } from '../client/Client';
import { ClanWar } from './ClanWar';
import { Player } from './Player';
import { Badge } from './Badge';

export class ClanWarLeagueClanMember {
	public name: string;
	public tag: string;
	public townHallLevel: number;

	public constructor(data: APIClanWarLeagueClanMember) {
		this.name = data.name;
		this.tag = data.tag;
		this.townHallLevel = data.townHallLevel;
	}
}

export class ClanWarLeagueClan {
	public name: string;
	public tag: string;
	public clanLevel: number;
	public badgeUrls: Badge;
	public members: ClanWarLeagueClanMember[];

	public constructor(private readonly _client: Client, data: APIClanWarLeagueClan) {
		this.name = data.name;
		this.tag = data.tag;
		this.clanLevel = data.clanLevel;
		this.badgeUrls = new Badge(data.badgeUrls);
		this.members = data.members.map((mem) => new ClanWarLeagueClanMember(mem));
	}

	public async fetchMembers() {
		return (await Promise.allSettled(this.members.map((m) => this._client.getPlayer(m.tag))))
			.filter((res) => res.status === 'fulfilled')
			.map((res) => (res as PromiseFulfilledResult<Player>).value);
	}
}

export class ClanWarLeagueRound {
	public warTags: string[];

	public constructor(data: APIClanWarLeagueRound) {
		this.warTags = data.warTags;
	}
}

export class ClanWarLeagueGroup {
	public state: 'notInWar' | 'preparation' | 'inWar' | 'warEnded';
	public season: string;
	public clans: ClanWarLeagueClan[];
	public rounds: ClanWarLeagueRound[];

	public constructor(private readonly client: Client, data: APIClanWarLeagueGroup) {
		this.state = data.state;
		this.season = data.season;
		this.clans = data.clans.map((clan) => new ClanWarLeagueClan(client, clan));
		this.rounds = data.rounds.map((round) => new ClanWarLeagueRound(round));
	}

	/**
	 * This returns an array of {@link ClanWar} which fetches all wars in parallel.
	 * @param clanTag Optional clan tag. If present, this will only return wars which belong to this clan.
	 */
	public async getWars(clanTag?: string) {
		const rounds = this.rounds.filter((round) => !round.warTags.includes('#0'));
		if (!rounds.length) return [];
		const warTags = rounds.map((round) => round.warTags).flat();

		return (await Promise.allSettled(warTags.map((warTag) => this.client.getClanWarLeagueRound(warTag, clanTag))))
			.filter((res) => res.status === 'fulfilled')
			.map((res) => (res as PromiseFulfilledResult<ClanWar>).value)
			.filter((war) => (clanTag ? war.clan.tag === clanTag : true));
	}
}
