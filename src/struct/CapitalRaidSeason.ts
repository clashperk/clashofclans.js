import { Client } from '../client/Client';
import {
	APICapitalRaidSeason,
	APICapitalRaidSeasonAttackLog,
	APICapitalRaidSeasonDefenseLog,
	APICapitalRaidSeasonMember,
	OverrideOptions
} from '../types';
import { Util } from '../util/Util';
import { Player } from './Player';

export class CapitalRaidSeasonMember {
	/** The player's tag. */
	public name: string;

	/** The player's name. */
	public tag: string;

	/** The number of attacks the player has made. */
	public attacks: number;

	/** The number of attacks the player can make. */
	public attackLimit: number;

	/** The number of bonus attacks the player can make. */
	public bonusAttackLimit: number;

	/** The number of capital resources the player has looted. */
	public capitalResourcesLooted: number;

	public constructor(data: APICapitalRaidSeasonMember) {
		this.tag = data.tag;
		this.name = data.name;
		this.attacks = data.attacks;
		this.attackLimit = data.attackLimit;
		this.bonusAttackLimit = data.bonusAttackLimit;
		this.capitalResourcesLooted = data.capitalResourcesLooted;
	}
}

/** Represents a Capital Raid Season. */
export class CapitalRaidSeason {
	/** The state of the raid season. */
	public state: 'ongoing' | 'ended';

	/** The start time of the raid season. */
	public startTime: Date;

	/** The end time of the raid season. */
	public endTime: Date;

	/** The total loot collected from the capital. */
	public capitalTotalLoot: number;

	/** The number of raids completed. */
	public raidsCompleted: number;

	/** The total number of attacks. */
	public totalAttacks: number;

	/** The number of enemy districts destroyed. */
	public enemyDistrictsDestroyed: number;

	/** The offensive reward. */
	public offensiveReward: number;

	/** The defensive reward. */
	public defensiveReward: number;

	/** The members of the raid season. */
	public members: APICapitalRaidSeasonMember[];

	/** The attack log of the raid season. */
	public attackLog: APICapitalRaidSeasonAttackLog[];

	/** The defense log of the raid season. */
	public defenseLog: APICapitalRaidSeasonDefenseLog[];

	public constructor(
		private readonly client: Client,
		data: APICapitalRaidSeason
	) {
		this.state = data.state;
		this.startTime = Util.formatDate(data.startTime);
		this.endTime = Util.formatDate(data.endTime);
		this.capitalTotalLoot = data.capitalTotalLoot;
		this.raidsCompleted = data.raidsCompleted;
		this.totalAttacks = data.totalAttacks;
		this.enemyDistrictsDestroyed = data.enemyDistrictsDestroyed;
		this.offensiveReward = data.offensiveReward;
		this.defensiveReward = data.defensiveReward;
		this.attackLog = data.attackLog;
		this.defenseLog = data.defenseLog;
		this.members = (data.members ?? []).map((member) => new CapitalRaidSeasonMember(member));
	}

	/** Get {@link Player} info for every Player in the clan. */
	public async fetchMembers(options?: OverrideOptions) {
		return (await Promise.allSettled(this.members.map((m) => this.client.getPlayer(m.tag, { ...options, ignoreRateLimit: true }))))
			.filter((res) => res.status === 'fulfilled')
			.map((res) => (res as PromiseFulfilledResult<Player>).value);
	}
}
