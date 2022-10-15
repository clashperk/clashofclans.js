import { APICapitalRaidSeason, APICapitalRaidSeasonAttackLog, APICapitalRaidSeasonDefenseLog, APICapitalRaidSeasonMember } from '../types';

export class CapitalRaidSeason {
	public state: string;
	public startTime: string;
	public endTime: string;
	public capitalTotalLoot: number;
	public raidsCompleted: number;
	public totalAttacks: number;
	public enemyDistrictsDestroyed: number;
	public offensiveReward: number;
	public defensiveReward: number;
	public members: APICapitalRaidSeasonMember[];
	public attackLog: APICapitalRaidSeasonAttackLog[];
	public defenseLog: APICapitalRaidSeasonDefenseLog[];

	public constructor(data: APICapitalRaidSeason) {
		this.state = data.state;
		this.startTime = data.startTime;
		this.endTime = data.endTime;
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
