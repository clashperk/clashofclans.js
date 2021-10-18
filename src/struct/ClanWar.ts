import { APIClanWar, APIClanWarAttack, APIClanWarMember, APIWarClan, APIWarState } from '../types';
import { Client } from '../client/Client';
import { Badge } from './Badge';
import Util from '../util/Util';

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

export class BaseWarClan {
	public tag: string;
	public name: string;
	public badge: Badge;
	public clanLevel: number;
	public stars: number;
	public destructionPercentage: number;

	public constructor(data: APIWarClan) {
		this.name = data.name;
		this.tag = data.tag;
		this.badge = new Badge(data.badgeUrls);
		this.clanLevel = data.clanLevel;
		this.stars = data.stars;
		this.destructionPercentage = data.destructionPercentage;
	}
}

export class WarClan extends BaseWarClan {
	public members: ClanWarMember[];
	public attacks: number;

	public constructor(data: APIWarClan) {
		super(data);

		this.attacks = data.attacks;
		this.members = data.members.map((mem) => new ClanWarMember(mem));
	}
}

export class ClanWar {
	public state: APIWarState;
	public teamSize: number;
	public startTime: Date;
	public preparationStartTime: Date;
	public endTime: Date;
	public clan: WarClan;
	public opponent: WarClan;
	public attacksPerMember: number;

	public constructor(private readonly client: Client, data: APIClanWar) {
		this.state = data.state;
		this.teamSize = data.teamSize;
		this.startTime = Util.parseDate(data.startTime);
		this.preparationStartTime = Util.parseDate(data.preparationStartTime);
		this.endTime = Util.parseDate(data.endTime);
		this.clan = new WarClan(data.clan);
		this.opponent = new WarClan(data.opponent);
		this.attacksPerMember = data.attacksPerMember;
	}
}
