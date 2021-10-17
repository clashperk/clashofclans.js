import {
	APIClanWarLeagueClan,
	APIClanWarLeagueClanMember,
	APIClanWarLeagueGroup,
	APIClanWarLeagueRound
} from '../types';
import { Client } from '../client/Client';
import { Badge } from '..';

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

	public constructor(data: APIClanWarLeagueClan) {
		this.name = data.name;
		this.tag = data.tag;
		this.clanLevel = data.clanLevel;
		this.badgeUrls = new Badge(data.badgeUrls);
		this.members = data.members.map((mem) => new ClanWarLeagueClanMember(mem));
	}
}

export class ClanWarLeagueRound {
	public warTags: string[];

	public constructor(data: APIClanWarLeagueRound) {
		this.warTags = data.warTags;
	}
}

export default class ClanWarLeagueGroup {
	public state: 'notInWar' | 'preparation' | 'inWar' | 'warEnded';
	public season: string;
	public clans: ClanWarLeagueClan[];
	public rounds: ClanWarLeagueRound[];

	public constructor(private readonly client: Client, data: APIClanWarLeagueGroup) {
		this.state = data.state;
		this.season = data.season;
		this.clans = data.clans.map((clan) => new ClanWarLeagueClan(clan));
		this.rounds = data.rounds.map((round) => new ClanWarLeagueRound(round));
	}
}
