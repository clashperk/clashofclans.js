import { UNRANKED_LEAGUE_DATA } from '../util/Constants';
import { Client } from '../client/Client';
import { APIClanMember } from '../types';
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

	/** Fetch detailed clan info for the member's clan. */
	public async fetch() {
		return this.client.getPlayer(this.tag);
	}
}
