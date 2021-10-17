import RequestHandler from './RequestHandler';
import { Client } from '../client/Client';

export default class RESTManager {
	private readonly client: Client;
	private readonly handler: RequestHandler;

	public constructor(client: Client) {
		this.client = client;
		this.handler = new RequestHandler(client);
	}

	public async getClans(options: ClanSearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request(`/clans?${query}`);
	}

	public async getClan(clanTag: string) {
		return this.handler.request(`/clans/${this.encodeTag(clanTag)}`);
	}

	public async getClanMembers(clanTag: string, options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request(`/clans/${this.encodeTag(clanTag)}/members?${query}`);
	}

	public async getClanWarLog(clanTag: string, options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request(`/clans/${this.encodeTag(clanTag)}/warlog?${query}`);
	}

	public async getCurrentWar(clanTag: string, options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request(`/clans/${this.encodeTag(clanTag)}/currentwar?${query}`);
	}

	public async getClanWarLeagueGroup(clanTag: string) {
		return this.handler.request(`/clans/${this.encodeTag(clanTag)}/currentwar/leaguegroup`);
	}

	public async getClanWarLeagueWar(warTag: string) {
		return this.handler.request(`/clanwarleagues/wars/${this.encodeTag(warTag)}`);
	}

	public async getPlayer(playerTag: string) {
		return this.handler.request(`/players/${this.encodeTag(playerTag)}`);
	}

	public async postPlayerToken(playerTag: string, token: string) {
		const options = { method: 'POST', body: JSON.stringify({ token }) };
		return this.handler.request(`/players/${this.encodeTag(playerTag)}/verifytoken`, options);
	}

	public async getLeagues(options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request(`/leagues?${query}`);
	}

	public async getLeague(leagueId: string | number) {
		return this.handler.request(`/leagues/${leagueId}`);
	}

	public async getLeagueSeason(leagueId: string | number, options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request(`/leagues/${leagueId}/seasons?${query}`);
	}

	public async getLeagueRanking(leagueId: string | number, seasonId: string, options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request(`/leagues/${leagueId}/seasons/${seasonId}?${query}`);
	}

	public async getWarLeagues(options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request(`/warleagues?${query}`);
	}

	public async getWarLeague(leagueId: string | number) {
		return this.handler.request(`/warleagues/${leagueId}`);
	}

	public async getLocations(options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request(`/locations?${query}`);
	}

	public async getLocation(locationId: string | number) {
		return this.handler.request(`/locations/${locationId}`);
	}

	public async getClanRanks(locationId: string | number, options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request(`/locations/${locationId}/rankings/clans?${query}`);
	}

	public async getPlayerRanks(locationId: string | number, options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request(`/locations/${locationId}/rankings/players?${query}`);
	}

	public async getVersusClanRanks(locationId: string | number, options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request(`/locations/${locationId}/rankings/clans-versus?${query}`);
	}

	public async getVersusPlayerRanks(locationId: string | number, options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request(`/locations/${locationId}/rankings/players-versus?${query}`);
	}

	public async getClanLabels(options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request(`/labels/clans?${query}`);
	}

	public async getPlayerLabels(options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request(`/labels/players?${query}`);
	}

	public async getGoldPassSeason() {
		return this.handler.request('/goldpass/seasons/current');
	}

	private encodeTag(tag: string) {
		return this.client.util.encodeTag(tag);
	}

	private getQueryString(options = {}) {
		return new URLSearchParams(options).toString();
	}
}

export interface SearchOptions {
	limit?: number;
	after?: string;
	before?: string;
}

export interface ClanSearchOptions extends SearchOptions {
	name?: string;
	warFrequency?: string;
	locationId?: string;
	minMembers?: number;
	maxMembers?: number;
	minClanPoints?: number;
	minClanLevel?: number;
	labelIds?: string;
}
