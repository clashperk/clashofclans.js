import { RequestHandler, ClientOptions } from './RequestHandler';
import { encodeTag } from '../util/Util';

import {
	APIClan,
	APIClanList,
	APIClanMemberList,
	APIClanRankingList,
	APIClanVersusRankingList,
	APIClanWar,
	APIClanWarLeagueGroup,
	APIClanWarLog,
	APIGoldPassSeason,
	APILabelList,
	APILeague,
	APILeagueList,
	APILeagueSeasonList,
	APILocation,
	APILocationList,
	APIPlayer,
	APIPlayerRankingList,
	APIPlayerSeasonRankingList,
	APIPlayerVersusRankingList,
	APIVerifyToken,
	APIWarLeague,
	APIWarLeagueList
} from '../types';

export class RESTManager {
	public readonly handler: RequestHandler;

	public constructor(options?: ClientOptions) {
		this.handler = new RequestHandler(options);
	}

	public getClans(options: ClanSearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<APIClanList>(`/clans?${query}`);
	}

	public getClan(clanTag: string) {
		return this.handler.request<APIClan>(`/clans/${this.encodeTag(clanTag)}`);
	}

	public getClanMembers(clanTag: string, options?: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<APIClanMemberList>(`/clans/${this.encodeTag(clanTag)}/members?${query}`);
	}

	public getClanWarLog(clanTag: string, options?: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<APIClanWarLog>(`/clans/${this.encodeTag(clanTag)}/warlog?${query}`);
	}

	public getCurrentWar(clanTag: string) {
		return this.handler.request<APIClanWar>(`/clans/${this.encodeTag(clanTag)}/currentwar`);
	}

	public getClanWarLeagueGroup(clanTag: string) {
		return this.handler.request<APIClanWarLeagueGroup>(`/clans/${this.encodeTag(clanTag)}/currentwar/leaguegroup`);
	}

	public getClanWarLeagueRound(warTag: string) {
		return this.handler.request<APIClanWar>(`/clanwarleagues/wars/${this.encodeTag(warTag)}`);
	}

	public getPlayer(playerTag: string) {
		return this.handler.request<APIPlayer>(`/players/${this.encodeTag(playerTag)}`);
	}

	public postPlayerToken(playerTag: string, token: string) {
		const options = { method: 'POST', body: JSON.stringify({ token }) };
		return this.handler.request<APIVerifyToken>(`/players/${this.encodeTag(playerTag)}/verifytoken`, options);
	}

	public getLeagues(options?: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<APILeagueList>(`/leagues?${query}`);
	}

	public getLeague(leagueId: string | number) {
		return this.handler.request<APILeague>(`/leagues/${leagueId}`);
	}

	public getLeagueSeasons(leagueId: number, options?: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<APILeagueSeasonList>(`/leagues/${leagueId}/seasons?${query}`);
	}

	public getSeasonRankings(leagueId: number, seasonId: string, options?: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<APIPlayerSeasonRankingList>(`/leagues/${leagueId}/seasons/${seasonId}?${query}`);
	}

	public getWarLeagues(options?: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<APIWarLeagueList>(`/warleagues?${query}`);
	}

	public getWarLeague(leagueId: number) {
		return this.handler.request<APIWarLeague>(`/warleagues/${leagueId}`);
	}

	public getLocations(options?: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<APILocationList>(`/locations?${query}`);
	}

	public getLocation(locationId: number) {
		return this.handler.request<APILocation>(`/locations/${locationId}`);
	}

	public getClanRanks(locationId: number | string, options?: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<APIClanRankingList>(`/locations/${locationId}/rankings/clans?${query}`);
	}

	public getPlayerRanks(locationId: number | string, options?: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<APIPlayerRankingList>(`/locations/${locationId}/rankings/players?${query}`);
	}

	public getVersusClanRanks(locationId: number | string, options?: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<APIClanVersusRankingList>(`/locations/${locationId}/rankings/clans-versus?${query}`);
	}

	public getVersusPlayerRanks(locationId: number | string, options?: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<APIPlayerVersusRankingList>(`/locations/${locationId}/rankings/players-versus?${query}`);
	}

	public getClanLabels(options?: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<APILabelList>(`/labels/clans?${query}`);
	}

	public getPlayerLabels(options?: SearchOptions) {
		const query = this.getQueryString(options);
		return this.handler.request<APILabelList>(`/labels/players?${query}`);
	}

	public getGoldPassSeason() {
		return this.handler.request<APIGoldPassSeason>('/goldpass/seasons/current');
	}

	private encodeTag(tag: string) {
		return encodeTag(tag);
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
