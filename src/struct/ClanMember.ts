import { Client } from '../client/Client';
import { APIClanMember, APILeagueTier, APIPlayerHouse, OverrideOptions } from '../types';
import { UnrankedLeagueData } from '../util/Constants';
import { Enumerable } from '../util/Decorators';
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

	/** The member's Town Hall level. */
	public townHallLevel: number;

	/** The member's current League. */
	public league: League;

	/** The member's current Builder Base League. */
	public builderBaseLeague: Omit<APILeagueTier, 'iconUrls'> | null;

	/** The member's trophy count. */
	public trophies: number;

	/** The member's builder base trophy count. */
	public builderBaseTrophies: number | null;

	/** The member's rank in the clan. */
	public clanRank: number;

	/** The member's rank before the last leader-board change. */
	public previousClanRank: number;

	/** The member's donation count for this season. */
	public donations: number;

	/** The member's donation received count for this season. */
	public received: number;

	/** The member's player house details. */
	public playerHouse?: APIPlayerHouse | null;

	@Enumerable(false)
	private readonly client: Client;

	public constructor(client: Client, data: APIClanMember) {
		this.client = client;
		this.name = data.name;
		this.tag = data.tag;
		// @ts-expect-error
		this.role = data.role.replace('admin', 'elder');
		this.expLevel = data.expLevel;
		// eslint-disable-next-line
		this.league = new League(data.leagueTier ?? UnrankedLeagueData);
		this.trophies = data.trophies;
		this.builderBaseTrophies = data.builderBaseTrophies ?? null;
		this.clanRank = data.clanRank;
		this.previousClanRank = data.previousClanRank;
		this.donations = data.donations;
		this.playerHouse = data.playerHouse ?? null;
		this.received = data.donationsReceived;
		this.townHallLevel = data.townHallLevel;
		this.builderBaseLeague = data.builderBaseLeague ?? null;
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
