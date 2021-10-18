import { Client } from '../client/Client';
import { APIClanMember } from '../types';
import { League } from './League';

export class ClanMember {
	public name: string;
	public tag: string;
	public role: string;
	public expLevel: number;
	public league: League;
	public trophies: number;
	public versusTrophies: number;
	public clanRank: number;
	public previousClanRank: number;
	public donations: number;
	public donationsReceived: number;

	public constructor(public client: Client, data: APIClanMember) {
		/**
		 * Name of the member
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * Tag of the member
		 * @type {string}
		 */
		this.tag = data.tag;

		/**
		 * Role of member
		 * @type {string}
		 */
		this.role = data.role;

		/**
		 * EXP Level of the member
		 * @type {number}
		 */
		this.expLevel = data.expLevel;

		/**
		 * League of the member
		 * @type {League}
		 */
		this.league = new League(data.league);

		/**
		 * Trophies of the member
		 * @type {number}
		 */
		this.trophies = data.trophies;

		/**
		 * Versus trophies of the member
		 * @type {number}
		 */
		this.versusTrophies = data.versusTrophies;

		/**
		 * Clan rank of the member
		 * @type {number}
		 */
		this.clanRank = data.clanRank;

		/**
		 * Previous clan rank of the member
		 * @type {number}
		 */
		this.previousClanRank = data.previousClanRank;

		/**
		 * Donations of the member
		 * @type {number}
		 */
		this.donations = data.donations;

		/**
		 * Donations Received of the member
		 * @type {number}
		 */
		this.donationsReceived = data.donationsReceived;
	}

	public async fetch() {
		return this.client.getPlayer(this.tag);
	}
}
