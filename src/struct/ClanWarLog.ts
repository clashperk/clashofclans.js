import { APIClanWarLogEntry, APIWarClan } from '../types';
import { Client } from '../client/Client';
import { BaseWarClan } from './ClanWar';
import moment from 'moment';

export class WarLogClan extends BaseWarClan {
	/** This property is null for opponent. */
	public expEarned!: number | null;

	/** This property is null for opponent. */
	public attacks!: number | null;

	public constructor(data: APIWarClan) {
		super(data);

		this.attacks = data.attacks || null;
		this.expEarned = data.expEarned ?? null;
	}
}

export class ClanWarLog {
	public result: 'win' | 'lose' | 'tie' | null;
	public endTime: Date;
	public teamSize: number;
	public attacksPerMember: number | null;
	public clan: WarLogClan;

	/** CWL entries have no opponent. */
	public opponent: WarLogClan | null;

	public constructor(public client: Client, data: APIClanWarLogEntry) {
		this.result = data.result;
		this.endTime = moment(data.endTime).toDate();
		this.teamSize = data.teamSize;
		this.attacksPerMember = data.attacksPerMember ?? null;

		// @ts-expect-error
		this.clan = new WarLogClan(data.clan);

		// @ts-expect-error
		this.opponent = data.opponent.tag ? new WarLogClan(data.opponent) : null; // eslint-disable-line
	}
}
