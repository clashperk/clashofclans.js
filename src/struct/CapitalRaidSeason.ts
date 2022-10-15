import { APICapitalRaidSeason, APICapitalRaidSeasonAttackLog, APICapitalRaidSeasonDefenseLog, APICapitalRaidSeasonMember } from '../types';
import { Util } from '../util/Util';

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

	public constructor(data: APICapitalRaidSeason) {
		this.state = data.state;
		this.startTime = Util.formatDate(data.startTime);
		this.endTime = Util.formatDate(data.endTime);
		this.capitalTotalLoot = data.capitalTotalLoot;
		this.raidsCompleted = data.raidsCompleted;
		this.totalAttacks = data.totalAttacks;
		this.enemyDistrictsDestroyed = data.enemyDistrictsDestroyed;
		this.offensiveReward = data.offensiveReward;
		this.defensiveReward = data.defensiveReward;
		this.members = data.members ?? [];
		this.attackLog = data.attackLog;
		this.defenseLog = data.defenseLog;
	}
}
