import { APIClanWar, APIClanWarAttack, APIClanWarMember, APIWarClan, APIWarState } from '../types';
import { Client } from '../client/Client';
import { Badge } from './Badge';

export class ClanWarAttack {
	public order: number;
	public attackerTag: string;
	public defenderTag: string;
	public stars: number;
	public duration: number;
	public destructionPercentage: number;

	public constructor(data: APIClanWarAttack) {
		this.order = data.order;
		this.attackerTag = data.attackerTag;
		this.defenderTag = data.defenderTag;
		this.stars = data.stars;
		this.duration = data.duration;
		this.destructionPercentage = data.destructionPercentage;
	}
}

export class ClanWarMember {
	public name: string;
	public tag: string;
	public mapPosition: number;
	public townHallLevel: number;
	public attacks: ClanWarAttack[];
	public opponentAttacks: number;
	public bestOpponentAttack: APIClanWarAttack | null;

	public constructor(data: APIClanWarMember) {
		this.name = data.name;
		this.tag = data.tag;
		this.mapPosition = data.mapPosition;
		this.townHallLevel = data.townhallLevel;
		this.attacks = data.attacks?.map((atk) => new ClanWarAttack(atk)) ?? [];
		this.opponentAttacks = data.opponentAttacks;
		this.bestOpponentAttack = data.bestOpponentAttack ? new ClanWarAttack(data.bestOpponentAttack) : null;
	}
}

export class WarClan {
	public tag: string;
	public name: string;
	public badgeUrls: Badge;
	public clanLevel: number;
	public attacks: number;
	public stars: number;
	public destructionPercentage: number;
	public members: ClanWarMember[];

	public constructor(data: APIWarClan) {
		this.name = data.name;
		this.tag = data.tag;
		this.badgeUrls = new Badge(data.badgeUrls);
		this.clanLevel = data.clanLevel;
		this.attacks = data.attacks;
		this.stars = data.stars;
		this.destructionPercentage = data.destructionPercentage;
		this.members = data.members.map((mem) => new ClanWarMember(mem));
	}
}

export default class ClanWar {
	public state: APIWarState;
	public teamSize: number;
	public startTime: string;
	public preparationStartTime: string;
	public endTime: string;
	public clan: WarClan;
	public opponent: WarClan;
	public attacksPerMember: number;

	public constructor(private readonly client: Client, data: APIClanWar) {
		this.state = data.state;
		this.teamSize = data.teamSize;
		this.startTime = data.startTime;
		this.preparationStartTime = data.preparationStartTime;
		this.endTime = data.endTime;
		this.clan = new WarClan(data.clan);
		this.opponent = new WarClan(data.opponent);
		this.attacksPerMember = data.attacksPerMember;
	}
}
