import { APIClanWar, APIClanWarAttack, APIClanWarMember, APIWarClan, APIWarState } from '../types';
import { Client } from '../client/Client';
import { Badge } from './Badge';

export class ClanWarAttack {
	public war: ClanWar;
	public order: number;
	public attackerTag: string;
	public defenderTag: string;
	public stars: number;
	public duration: number;
	public destruction: number;

	public constructor(member: ClanWarMember, data: APIClanWarAttack) {
		this.war = member.war;

		this.order = data.order;
		this.attackerTag = data.attackerTag;
		this.defenderTag = data.defenderTag;
		this.stars = data.stars;
		this.duration = data.duration;
		this.destruction = data.destructionPercentage;
	}

	public get defender() {
		return this.war.getMember(this.defenderTag)!;
	}

	public get attacker() {
		return this.war.getMember(this.attackerTag);
	}

	public get isFresh() {
		if (this.defender.defenses.length === 1) return true;
		return this.order === Math.min(...this.defender.defenses.map((def) => def.order));
	}
}

export class ClanWarMember {
	public war: ClanWar;
	public clan: WarClan;

	public name: string;
	public tag: string;
	public mapPosition: number;
	public townHallLevel: number;
	public attacks: ClanWarAttack[];
	public opponentAttacks: number;
	public bestOpponentAttack: ClanWarAttack | null;

	public constructor(clan: WarClan, data: APIClanWarMember) {
		this.clan = clan;
		this.war = clan.war;

		this.name = data.name;
		this.tag = data.tag;
		this.mapPosition = data.mapPosition;
		this.townHallLevel = data.townhallLevel;
		this.attacks = data.attacks?.map((atk) => new ClanWarAttack(this, atk)) ?? [];
		this.opponentAttacks = data.opponentAttacks;
		this.bestOpponentAttack = data.bestOpponentAttack ? new ClanWarAttack(this, data.bestOpponentAttack) : null;
	}

	public get isOpponent() {
		return this.clan.tag === this.war.opponent.tag;
	}

	public get defenses() {
		return this.war.getDefenses(this.tag);
	}

	/**
	 * Returns the previous best opponent attack on this village.
	 * - This is useful for calculating the new stars or destruction for new attacks.
	 */
	public previousBestOpponentAttack() {
		return (
			// Let's not change the original array
			[...this.defenses]
				.filter((def) => def.attackerTag !== this.bestOpponentAttack?.attackerTag)
				.sort((a, b) => b.destruction ** b.stars - a.destruction ** a.stars)
				.pop() ?? null
		);
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

	public constructor(public war: ClanWar, data: APIWarClan) {
		super(data);

		this.attacks = data.attacks;
		this.members = data.members.map((mem) => new ClanWarMember(this, mem));
	}

	public getMember(tag: string) {
		return this.members.find((m) => m.tag === tag);
	}

	public get averageAttackDuration() {
		if (!this.attacks) return 0;
		return this._attacks.reduce((prev, curr) => prev + curr.duration, 0) / this.attacks;
	}

	public get _attacks() {
		return this.members
			.filter((m) => m.attacks.length)
			.map((m) => m.attacks)
			.flat();
	}
}

export class ClanWar {
	public state: APIWarState;
	public teamSize: number;
	public attacksPerMember: number;
	public preparationStartTime: Date;
	public startTime: Date;
	public endTime: Date;
	public clan: WarClan;
	public opponent: WarClan;

	public constructor(public client: Client, public clanTag: string, data: APIClanWar) {
		this.state = data.state;
		this.teamSize = data.teamSize;
		this.attacksPerMember = data.attacksPerMember;
		this.preparationStartTime = client.util.parseDate(data.preparationStartTime);
		this.startTime = client.util.parseDate(data.startTime);
		this.endTime = client.util.parseDate(data.endTime);

		const clan = data.clan.tag === clanTag ? data.clan : data.opponent;
		const opponent = data.clan.tag === clan.tag ? data.opponent : data.clan;

		this.clan = new WarClan(this, clan);
		this.opponent = new WarClan(this, opponent);
	}

	public getMember(tag: string) {
		return this.clan.getMember(tag) ?? this.opponent.getMember(tag) ?? null;
	}

	public getAttack(attackerTag: string, defenderTag: string) {
		const attacker = this.getMember(attackerTag);
		if (!attacker?.attacks.length) return null;
		return attacker.attacks.find((atk) => atk.defenderTag === defenderTag) ?? null;
	}

	public getDefenses(defenderTag: string) {
		const defender = this.getMember(defenderTag)!;
		if (defender.isOpponent) {
			return this.clan._attacks.filter((atk) => atk.defenderTag === defenderTag);
		}
		return this.opponent._attacks.filter((atk) => atk.defenderTag === defenderTag);
	}
}
