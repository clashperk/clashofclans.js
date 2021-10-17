import RequestHandler from './RequestHandler';
import { Client } from '../client/Client';

import {
	APIClan,
	ClanList,
	ClanMemberList,
	ClanRankingList,
	ClanVersusRankingList,
	ClanWar,
	ClanWarLeagueGroup,
	ClanWarLog,
	GoldPassSeason,
	LabelList,
	League,
	LeagueList,
	LeagueSeasonList,
	Location,
	LocationList,
	APIPlayer,
	PlayerRankingList,
	PlayerSeasonRankingList,
	PlayerVersusRankingList,
	VerifyToken,
	WarLeague,
	WarLeagueList
} from '../types';

export default class RESTManager {
	private readonly client: Client;
	private readonly handler: RequestHandler;

	public constructor(client: Client) {
		this.client = client;
		this.handler = new RequestHandler(client);
	}

	public getClans(options: ClanSearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<ClanList>(`/clans?${query}`);
	}

	public getClan(clanTag: string) {
		return this.handler.request<APIClan>(`/clans/${this.encodeTag(clanTag)}`);
	}

	public getClanMembers(clanTag: string, options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<ClanMemberList>(`/clans/${this.encodeTag(clanTag)}/members?${query}`);
	}

	public getClanWarLog(clanTag: string, options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<ClanWarLog>(`/clans/${this.encodeTag(clanTag)}/warlog?${query}`);
	}

	public getCurrentWar(clanTag: string, options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<ClanWar>(`/clans/${this.encodeTag(clanTag)}/currentwar?${query}`);
	}

	public getClanWarLeagueGroup(clanTag: string) {
		return this.handler.request<ClanWarLeagueGroup>(`/clans/${this.encodeTag(clanTag)}/currentwar/leaguegroup`);
	}

	public getClanWarLeagueWar(warTag: string) {
		return this.handler.request<ClanWar>(`/clanwarleagues/wars/${this.encodeTag(warTag)}`);
	}

	public getPlayer(playerTag: string) {
		return this.handler.request<APIPlayer>(`/players/${this.encodeTag(playerTag)}`);
	}

	public postPlayerToken(playerTag: string, token: string) {
		const options = { method: 'POST', body: JSON.stringify({ token }) };
		return this.handler.request<VerifyToken>(`/players/${this.encodeTag(playerTag)}/verifytoken`, options);
	}

	public getLeagues(options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<LeagueList>(`/leagues?${query}`);
	}

	public getLeague(leagueId: string | number) {
		return this.handler.request<League>(`/leagues/${leagueId}`);
	}

	public getLeagueSeason(leagueId: string | number, options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<LeagueSeasonList>(`/leagues/${leagueId}/seasons?${query}`);
	}

	public getLeagueRanking(leagueId: string | number, seasonId: string, options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<PlayerSeasonRankingList>(`/leagues/${leagueId}/seasons/${seasonId}?${query}`);
	}

	public getWarLeagues(options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<WarLeagueList>(`/warleagues?${query}`);
	}

	public getWarLeague(leagueId: string | number) {
		return this.handler.request<WarLeague>(`/warleagues/${leagueId}`);
	}

	public getLocations(options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<LocationList>(`/locations?${query}`);
	}

	public getLocation(locationId: string | number) {
		return this.handler.request<Location>(`/locations/${locationId}`);
	}

	public getClanRanks(locationId: string | number, options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<ClanRankingList>(`/locations/${locationId}/rankings/clans?${query}`);
	}

	public getPlayerRanks(locationId: string | number, options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<PlayerRankingList>(`/locations/${locationId}/rankings/players?${query}`);
	}

	public getVersusClanRanks(locationId: string | number, options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<ClanVersusRankingList>(`/locations/${locationId}/rankings/clans-versus?${query}`);
	}

	public getVersusPlayerRanks(locationId: string | number, options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<PlayerVersusRankingList>(
			`/locations/${locationId}/rankings/players-versus?${query}`
		);
	}

	public getClanLabels(options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<LabelList>(`/labels/clans?${query}`);
	}

	public getPlayerLabels(options: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<LabelList>(`/labels/players?${query}`);
	}

	public getGoldPassSeason() {
		return this.handler.request<GoldPassSeason>('/goldpass/seasons/current');
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
