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

	/** The member's rank before the last leaderboard change. */
	public previousClanRank: number;

	/** The member's donation count for this season. */
	public donations: number;

	/** The member's donation received count for this season. */
	public donationsReceived: number; // TODO

	public constructor(public client: Client, data: APIClanMember) {
		this.name = data.name;
		this.tag = data.tag;
		this.role = (data.role as any).replace('admin', 'elder'); // TODO
		this.expLevel = data.expLevel;
		this.league = new League(data.league);
		this.trophies = data.trophies;
		this.versusTrophies = data.versusTrophies ?? null;
		this.clanRank = data.clanRank;
		this.previousClanRank = data.previousClanRank;
		this.donations = data.donations;
		this.donationsReceived = data.donationsReceived;
	}

	/** Fetch detailed clan info for the member's clan. */
	public async fetch() {
		return this.client.getPlayer(this.tag);
	}
}
