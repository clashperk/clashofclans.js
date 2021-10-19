import { APIClanWar, APIClanWarAttack, APIClanWarMember, APIWarClan, APIWarState } from '../types';
import { Client } from '../client/Client';
import { Badge } from './Badge';

export class ClanWarAttack {
	/** The war this attack belongs to. */
	public war!: ClanWar;

	/** The clan this attack belongs to. */
	public clan!: WarClan;

	public attackerTag: string;
	public defenderTag: string;
	public order: number;
	public stars: number;
	public duration: number;
	public destruction: number;

	public constructor(clan: WarClan, war: ClanWar, data: APIClanWarAttack) {
		Object.defineProperty(this, 'clan', { value: clan });
		Object.defineProperty(this, 'war', { value: war });

		this.attackerTag = data.attackerTag;
		this.defenderTag = data.defenderTag;
		this.order = data.order;
		this.stars = data.stars;
		this.duration = data.duration;
		this.destruction = data.destructionPercentage;
	}

	public get defender() {
		return this.war.getMember(this.defenderTag)!;
	}

	public get attacker() {
		return this.war.getMember(this.attackerTag)!;
	}

	/** Returns whether the attack is a fresh or first attack on the defender. */
	public isFresh() {
		if (this.defender.defenses.length === 1) return true;
		return this.order === Math.min(...this.defender.defenses.map((def) => def.order));
	}

	/**
	 * Returns the previous best attack on this opponent village.
	 * - This is useful for calculating the new stars or destruction for new attacks.
	 */
	public previousBestAttack() {
		if (this.isFresh()) return null;
		return (
			// Let's not change the original array
			[...this.clan.attacks]
				.filter((atk) => atk.defenderTag === this.defenderTag && atk.attackerTag !== this.attackerTag)
				.sort((a, b) => b.destruction ** b.stars - a.destruction ** a.stars)
				.shift() ?? null
		);
	}
}

export class ClanWarMember {
	private readonly _bestOpponentAttackerTag?: string;

	/** The current war this member is in. */
	public war!: ClanWar;

	/** The member's clan. */
	public clan!: WarClan;

	public name: string;
	public tag: string;
	public mapPosition: number;
	public townHallLevel: number;
	public attacks: ClanWarAttack[];
	public opponentAttacks: number;

	public constructor(clan: WarClan, war: ClanWar, data: APIClanWarMember) {
		Object.defineProperty(this, 'clan', { value: clan });
		Object.defineProperty(this, 'war', { value: war });

		this.name = data.name;
		this.tag = data.tag;
		this.mapPosition = data.mapPosition;
		this.townHallLevel = data.townhallLevel;
		this.attacks = data.attacks?.map((atk) => new ClanWarAttack(clan, war, atk)) ?? [];
		this.opponentAttacks = data.opponentAttacks;
		this._bestOpponentAttackerTag = data.bestOpponentAttack?.attackerTag;
	}

	public get isOpponent() {
		return this.clan.tag === this.war.opponent.tag;
	}

	public get defenses() {
		return this.war.getDefenses(this.tag);
	}

	public get bestOpponentAttack(): ClanWarAttack | null {
		if (!this._bestOpponentAttackerTag) return null;
		return this.war.getAttack(this._bestOpponentAttackerTag, this.tag);
	}

	/**
	 * Returns the previous best opponent attack on this village.
	 * - This is useful for calculating the new stars or destruction for new attacks.
	 */
	public previousBestOpponentAttack() {
		return (
			// Let's not change the original array
			[...this.defenses]
				.filter((def) => def.defenderTag === this.tag && def.attackerTag !== this.bestOpponentAttack?.attackerTag)
				.sort((a, b) => b.destruction ** b.stars - a.destruction ** a.stars)
				.shift() ?? null
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
	public attacksUsed: number;

	public constructor(war: ClanWar, data: APIWarClan) {
		super(data);

		this.attacksUsed = data.attacks;
		this.members = data.members.map((mem) => new ClanWarMember(this, war, mem));
	}

	public getMember(tag: string) {
		return this.members.find((m) => m.tag === tag);
	}

	public get averageAttackDuration() {
		if (!this.attacksUsed) return 0;
		return this.attacks.reduce((prev, curr) => prev + curr.duration, 0) / this.attacksUsed;
	}

	public get attacks() {
		return this.members
			.filter((m) => m.attacks.length)
			.map((m) => m.attacks)
			.flat();
	}
}

export class ClanWar {
	public client!: Client;
	public state: APIWarState;
	public teamSize: number;
	public attacksPerMember: number;
	public preparationStartTime: Date;
	public startTime: Date;
	public endTime: Date;
	public clan: WarClan;
	public opponent: WarClan;

	public constructor(client: Client, data: APIClanWar, clanTag?: string) {
		Object.defineProperty(this, 'client', { value: client });

		this.state = data.state;
		this.teamSize = data.teamSize;
		this.attacksPerMember = data.attacksPerMember;
		this.preparationStartTime = client.util.parseDate(data.preparationStartTime);
		this.startTime = client.util.parseDate(data.startTime);
		this.endTime = client.util.parseDate(data.endTime);

		let [clan, opponent] = [data.clan, data.opponent];
		clanTag &&= client.util.parseTag(clanTag);
		if (clanTag && [data.clan.tag, data.opponent.tag].includes(clanTag)) {
			clan = data.clan.tag === clanTag ? data.clan : data.opponent;
			opponent = data.clan.tag === clan.tag ? data.opponent : data.clan;
		}

		this.clan = new WarClan(this, clan);
		this.opponent = new WarClan(this, opponent);
	}

	public getMember(tag: string): ClanWarMember | null {
		return this.clan.getMember(tag) ?? this.opponent.getMember(tag) ?? null;
	}

	public getAttack(attackerTag: string, defenderTag: string): ClanWarAttack | null {
		const attacker = this.getMember(attackerTag);
		if (!attacker?.attacks.length) return null;
		return attacker.attacks.find((atk) => atk.defenderTag === defenderTag) ?? null;
	}

	public getDefenses(defenderTag: string) {
		const defender = this.getMember(defenderTag)!;
		if (defender.isOpponent) {
			return this.clan.attacks.filter((atk) => atk.defenderTag === defenderTag);
		}
		return this.opponent.attacks.filter((atk) => atk.defenderTag === defenderTag);
	}
}
