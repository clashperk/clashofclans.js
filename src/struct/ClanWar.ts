import { Client } from '../client/Client';
import { APIClanWar, APIClanWarAttack, APIClanWarMember, APIWarClan } from '../types';
import { FriendlyWarPreparationTimes } from '../util/Constants';
import { Enumerable } from '../util/Decorators';
import { getWarResult } from '../util/Helper';
import { Badge } from './Badge';

/** Represents a Clash of Clans War Attack. */
export class ClanWarAttack {
	/** The war this attack belongs to. */
	public war!: ClanWar;

	/** The clan this attack belongs to. */
	public clan!: WarClan;

	/** The stars achieved. */
	public stars: number;

	/** The destruction achieved as a percentage. */
	public destruction: number;

	/** The attack order in this war. */
	public order: number;

	/** Duration of attack in seconds. */
	public duration: number;

	/** The attacker tag. */
	public attackerTag: string;

	/** The defender tag. */
	public defenderTag: string;

	public constructor(clan: WarClan, war: ClanWar, data: APIClanWarAttack) {
		Object.defineProperty(this, 'clan', { value: clan });
		Object.defineProperty(this, 'war', { value: war });

		this.stars = data.stars;
		this.destruction = data.destructionPercentage;
		this.order = data.order;
		this.duration = data.duration;
		this.attackerTag = data.attackerTag;
		this.defenderTag = data.defenderTag;
	}

	/** Returns the defending player. */
	public get defender() {
		return this.war.getMember(this.defenderTag)!;
	}

	/** Returns the attacking player. */
	public get attacker() {
		return this.war.getMember(this.attackerTag)!;
	}

	/** Returns whether the attack is a fresh or first attack on the defender. */
	public get isFresh() {
		if (this.defender.defenses.length === 1) return true;
		return this.order === Math.min(...this.defender.defenses.map((def) => def.order));
	}

	/**
	 * Returns the previous best attack on this opponent village.
	 * This is useful for calculating the new stars or destruction for new attacks.
	 */
	public previousBestAttack(): ClanWarAttack | null {
		if (this.isFresh) return null;
		return (
			// Let's not change the original array
			[...this.clan.attacks]
				.filter((atk) => atk.defenderTag === this.defenderTag && atk.order < this.order && atk.attackerTag !== this.attackerTag)
				.sort((a, b) => b.destruction ** b.stars - a.destruction ** a.stars)
				.at(0) ?? null
		);
	}

	/** Returns new stars on the defender. */
	public get newStars(): number {
		const prevBest = this.previousBestAttack();
		if (!prevBest) return this.stars;
		return Math.max(0, this.stars - prevBest.stars);
	}
}

/** Represents a Clash of Clans War Member. */
export class ClanWarMember {
	private readonly _bestOpponentAttackerTag?: string;

	/** The current war this member is in. */
	public war!: ClanWar;

	/** The member's clan. */
	public clan!: WarClan;

	/** The member's name. */
	public name: string;

	/** The member's tag. */
	public tag: string;

	/** The member's map position in the war. */
	public mapPosition: number;

	/** The member's town hall level. */
	public townHallLevel: number;

	/** The member's attacks this war. */
	public attacks: ClanWarAttack[];

	/** The number of times this member has been attacked. */
	public defenseCount: number;

	public constructor(clan: WarClan, war: ClanWar, data: APIClanWarMember) {
		Object.defineProperty(this, 'clan', { value: clan });
		Object.defineProperty(this, 'war', { value: war });

		this.name = data.name;
		this.tag = data.tag;
		this.mapPosition = data.mapPosition;
		this.townHallLevel = data.townhallLevel;
		this.attacks = data.attacks?.map((atk) => new ClanWarAttack(clan, war, atk)) ?? [];
		this.defenseCount = data.opponentAttacks;
		this._bestOpponentAttackerTag = data.bestOpponentAttack?.attackerTag;
	}

	/** Whether the member is from the opponent clan. */
	public get isOpponent() {
		return this.clan.tag === this.war.opponent.tag;
	}

	/** The member's defenses this war. */
	public get defenses() {
		return this.war.getDefenses(this.tag);
	}

	/** Best opponent attack on this base. */
	public get bestOpponentAttack(): ClanWarAttack | null {
		if (!this._bestOpponentAttackerTag) return null;
		return this.war.getAttack(this._bestOpponentAttackerTag, this.tag);
	}

	/** Get member's formatted link to open member in-game. */
	public get shareLink() {
		return `https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${this.tag.replace(/#/g, '')}`;
	}

	/**
	 * Returns the previous best opponent attack on this village.
	 * This is useful for calculating the new stars or destruction for new attacks.
	 *
	 * @deprecated `order` is affecting this method. Use {@link ClanWarAttack#previousBestAttack} instead.
	 */
	public previousBestOpponentAttack() {
		return (
			// Let's not change the original array
			[...this.defenses]
				.filter((def) => def.defenderTag === this.tag && def.attackerTag !== this.bestOpponentAttack?.attackerTag)
				.sort((a, b) => b.destruction ** b.stars - a.destruction ** a.stars)
				.at(0) ?? null
		);
	}
}

/** Represents a War Clan. */
export class WarClan {
	private readonly war!: ClanWar;

	/** The clan's name. */
	public name: string;

	/** The clan's tag. */
	public tag: string;

	/** The clan's badge. */
	public badge: Badge;

	/** The clan's level. */
	public level: number;

	/** Number of stars achieved by this clan. */
	public stars: number;

	/** The destruction achieved as a percentage. */
	public destruction: number;

	/** An array of members that are in the war. */
	public members: ClanWarMember[];

	/** Total attacks used by this clan. */
	public attackCount: number;

	public constructor(war: ClanWar, data: APIWarClan) {
		Object.defineProperty(this, 'war', { value: war });

		this.name = data.name;
		this.tag = data.tag;
		this.badge = new Badge(data.badgeUrls);
		this.level = data.clanLevel;
		this.stars = data.stars;
		this.attackCount = data.attacks;
		this.destruction = data.destructionPercentage;
		this.members = data.members.map((mem) => new ClanWarMember(this, war, mem));
	}

	/** Whether the clan is the opponent clan. */
	public get isOpponent() {
		return this.tag === this.war.opponent.tag;
	}

	/** Average duration of all clan member's attacks. */
	public get averageAttackDuration() {
		if (!this.attackCount) return 0;
		return this.attacks.reduce((prev, curr) => prev + curr.duration, 0) / this.attackCount;
	}

	/** Returns all clan member's attacks. */
	public get attacks() {
		return this.members
			.filter((m) => m.attacks.length)
			.map((m) => m.attacks)
			.flat()
			.sort((a, b) => a.order - b.order);
	}

	/** Returns all clan member's defenses. */
	public get defenses() {
		return this.isOpponent ? this.war.clan.attacks : this.war.opponent.attacks;
	}

	/** Get a member of the clan for the given tag, or `null` if not found. */
	public getMember(tag: string): ClanWarMember | null {
		return this.members.find((m) => m.tag === tag) ?? null;
	}

	/** Get a member of the clan for the given map position, or `null` if not found. */
	public getMemberByMapPosition(mapPosition: number): ClanWarMember | null {
		return this.members.find((m) => m.mapPosition === mapPosition) ?? null;
	}

	/** Get clan's formatted link to open clan in-game. */
	public get shareLink() {
		return `https://link.clashofclans.com/en?action=OpenClanProfile&tag=${this.tag.replace(/#/g, '')}`;
	}
}

/**
 * Represents a Clan War in Clash of Clans.
 *
 * :::caution
 * It's recommended to see if ClanWar#state is `notInWar` available before performing operations or reading data from it. You can check this with data.ok property.
 * :::
 */
export class ClanWar {
	/**
	 * The clan's current war state.
	 *
	 * :warning: Other properties won't be available if the state is `notInWar`.
	 */
	public state: 'preparation' | 'inWar' | 'warEnded' | 'notInWar';

	/** The number of players on each side. */
	public teamSize!: number;

	/** The number of attacks each member has. */
	public attacksPerMember!: number;

	/** The Date that preparation day started at. */
	public preparationStartTime!: Date;

	/** The Date that battle day starts at. */
	public startTime!: Date;

	/** The Date that battle day ends at. */
	public endTime!: Date;

	/** The home clan. */
	public clan!: WarClan;

	/** The opposition clan. */
	public opponent!: WarClan;

	/** The war's unique tag. This is `null` unless this is a CWL.  */
	public warTag!: string | null;

	@Enumerable(false)
	private readonly client: Client;

	public constructor(client: Client, data: APIClanWar, extra: { clanTag?: string; warTag?: string }) {
		this.client = client;
		this.state = data.state;
		if (this.state !== 'notInWar') {
			this.teamSize = data.teamSize;
			this.attacksPerMember = data.attacksPerMember ?? (extra.warTag ? 1 : 2);
			this.preparationStartTime = client.util.formatDate(data.preparationStartTime);
			this.startTime = client.util.formatDate(data.startTime);
			this.endTime = client.util.formatDate(data.endTime);
			this.warTag = extra.warTag ?? null;

			let [clan, opponent] = [data.clan, data.opponent];
			const clanTag = extra.clanTag && client.util.formatTag(extra.clanTag);
			if (clanTag && [data.clan.tag, data.opponent.tag].includes(clanTag)) {
				clan = data.clan.tag === clanTag ? data.clan : data.opponent;
				opponent = data.clan.tag === clan.tag ? data.opponent : data.clan;
			}
			this.clan = new WarClan(this, clan);
			this.opponent = new WarClan(this, opponent);
		}
	}

	/** Return a {@link ClanWarMember} with the tag provided. */
	public getMember(tag: string): ClanWarMember | null {
		return this.clan.getMember(tag) ?? this.opponent.getMember(tag) ?? null;
	}

	/** Return a list of {@link ClanWarAttack} for the attackerTag and defenderTag provided. */
	public getAttack(attackerTag: string, defenderTag: string): ClanWarAttack | null {
		const attacker = this.getMember(attackerTag);
		if (!attacker?.attacks.length) return null;
		return attacker.attacks.find((atk) => atk.defenderTag === defenderTag) ?? null;
	}

	/** Return a list of {@link ClanWarAttack} for the defenderTag provided. */
	public getDefenses(defenderTag: string) {
		const defender = this.getMember(defenderTag)!;
		if (defender.isOpponent) {
			return this.clan.attacks.filter((atk) => atk.defenderTag === defenderTag);
		}
		return this.opponent.attacks.filter((atk) => atk.defenderTag === defenderTag);
	}

	/** Whether the clan is not in war. */
	public get isNotInWar() {
		return this.state === 'notInWar';
	}

	/** Whether this is a Battle Day. */
	public get isBattleDay() {
		return this.state === 'inWar';
	}

	/** Whether this is a Preparation Day. */
	public get isPreparationDay() {
		return this.state === 'preparation';
	}

	/** Whether this War has Ended. */
	public get isWarEnded() {
		return this.state === 'warEnded';
	}

	/** Returns either `friendly`, `cwl` or `normal`. */
	public get type() {
		if (this.isFriendly) return 'friendly';
		if (this.warTag) return 'cwl';
		return 'normal';
	}

	/** Whether this is a friendly war. */
	public get isFriendly() {
		const preparationTime = this.startTime.getTime() - this.preparationStartTime.getTime();
		return FriendlyWarPreparationTimes.includes(preparationTime);
	}

	/** Whether this is a CWL. */
	public get isCWL() {
		return typeof this.warTag === 'string';
	}

	/** Whether this is a normal war. */
	public get isNormal() {
		return !this.isCWL && !this.isFriendly;
	}

	/** Returns the war status, based off the home clan. */
	public get status() {
		if (this.state === 'preparation') return 'pending';
		return getWarResult(
			{
				stars: this.clan.stars,
				destructionPercentage: this.clan.destruction
			},
			{
				stars: this.opponent.stars,
				destructionPercentage: this.opponent.destruction
			}
		);
	}

	/** Returns the Clan War League Group. */
	public getClanWarLeagueGroup() {
		if (!this.isCWL) return null;
		return this.client.getClanWarLeagueGroup(this.clan.tag);
	}
}
