import { APIClanMember, OverrideOptions } from '../types';
import { UNRANKED_LEAGUE_DATA } from '../util/Constants';
import { Client } from '../client/Client';
import { League } from './League';

export class ClanMember {
	/** The member's name. */
	public name: string;

	/** The member's tag. */
	public tag: string;

	/** The member's role in the clan. */
	public role: 'member' | 'elder' | 'coLeader' | 'leader';

	/** The member's experience level. */
	public expLevel: number;

	/** The member's current League. */
	public league: League;

	/** The member's trophy count. */
	public trophies: number;

	/** The member's versus trophy count. */
	public versusTrophies: number | null;

	/** The member's rank in the clan. */
	public clanRank: number;

	/** The member's rank before the last leader-board change. */
	public previousClanRank: number;

	/** The member's donation count for this season. */
	public donations: number;

	/** The member's donation received count for this season. */
	public received: number;

	public constructor(public client: Client, data: APIClanMember) {
		this.name = data.name;
		this.tag = data.tag;
		// @ts-expect-error
		this.role = data.role.replace('admin', 'elder');
		this.expLevel = data.expLevel;
		// eslint-disable-next-line
		this.league = new League(data.league ?? UNRANKED_LEAGUE_DATA);
		this.trophies = data.trophies;
		this.versusTrophies = data.versusTrophies ?? null;
		this.clanRank = data.clanRank;
		this.previousClanRank = data.previousClanRank;
		this.donations = data.donations;
		this.received = data.donationsReceived;
	}

	/** Whether this clan member is in the clan. */
	public get isMember() {
		return this.role === 'member';
	}

	/** Whether this clan member is an Elder. */
	public get isElder() {
		return this.role === 'elder';
	}

	/** Whether this clan member is a Co-Leader. */
	public get isCoLeader() {
		return this.role === 'coLeader';
	}

	/** Whether this clan member is a Leader. */
	public get isLeader() {
		return this.role === 'leader';
	}

	/** Fetch detailed clan info for the member's clan. */
	public async fetch(options?: OverrideOptions) {
		return this.client.getPlayer(this.tag, options);
	}
}
