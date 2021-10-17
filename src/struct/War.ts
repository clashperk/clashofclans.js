import { Client } from '../client/Client';
import { APIClanWar, APIWarClan, APIWarStatus } from '../types';

export default class War {
	public state: APIWarStatus;
	public teamSize: number;
	public startTime: string;
	public preparationStartTime: string;
	public endTime: string;
	public clan: APIWarClan;
	public opponent: APIWarClan;
	public attacksPerMember: number;

	public constructor(private readonly client: Client, data: APIClanWar) {
		this.state = data.state;
		this.teamSize = data.teamSize;
		this.startTime = data.startTime;
		this.preparationStartTime = data.preparationStartTime;
		this.endTime = data.endTime;
		this.clan = data.clan;
		this.opponent = data.opponent;
		this.attacksPerMember = data.attacksPerMember;
	}
}
