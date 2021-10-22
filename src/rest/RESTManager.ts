import { RequestHandler, SearchOptions, ClanSearchOptions, ClientOptions, OverrideOptions } from './RequestHandler';
import Util from '../util/Util';

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
		const query = Util.queryString(options);
		return this.handler.request<APIClanList>(`/clans?${query}`);
	}

	public getClan(clanTag: string, options?: OverrideOptions) {
		return this.handler.request<APIClan>(`/clans/${Util.encodeTag(clanTag)}`, options);
	}

	public getClanMembers(clanTag: string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APIClanMemberList>(`/clans/${Util.encodeTag(clanTag)}/members?${query}`, options);
	}

	public getClanWarLog(clanTag: string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APIClanWarLog>(`/clans/${Util.encodeTag(clanTag)}/warlog?${query}`, options);
	}

	public getCurrentWar(clanTag: string, options?: OverrideOptions) {
		return this.handler.request<APIClanWar>(`/clans/${Util.encodeTag(clanTag)}/currentwar`, options);
	}

	public getClanWarLeagueGroup(clanTag: string, options?: OverrideOptions) {
		return this.handler.request<APIClanWarLeagueGroup>(`/clans/${Util.encodeTag(clanTag)}/currentwar/leaguegroup`, options);
	}

	public getClanWarLeagueRound(warTag: string, options?: OverrideOptions) {
		return this.handler.request<APIClanWar>(`/clanwarleagues/wars/${Util.encodeTag(warTag)}`, options);
	}

	public getPlayer(playerTag: string, options?: OverrideOptions) {
		return this.handler.request<APIPlayer>(`/players/${Util.encodeTag(playerTag)}`, options);
	}

	public postPlayerToken(playerTag: string, token: string, options?: OverrideOptions) {
		const opts = { method: 'POST', body: JSON.stringify({ token }), ...options };
		return this.handler.request<APIVerifyToken>(`/players/${Util.encodeTag(playerTag)}/verifytoken`, opts);
	}

	public getLeagues(options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APILeagueList>(`/leagues?${query}`, options);
	}

	public getLeague(leagueId: string | number, options?: OverrideOptions) {
		return this.handler.request<APILeague>(`/leagues/${leagueId}`, options);
	}

	public getLeagueSeasons(leagueId: number, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APILeagueSeasonList>(`/leagues/${leagueId}/seasons?${query}`, options);
	}

	public getSeasonRankings(leagueId: number, seasonId: string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APIPlayerSeasonRankingList>(`/leagues/${leagueId}/seasons/${seasonId}?${query}`, options);
	}

	public getWarLeagues(options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APIWarLeagueList>(`/warleagues?${query}`, options);
	}

	public getWarLeague(leagueId: number, options?: OverrideOptions) {
		return this.handler.request<APIWarLeague>(`/warleagues/${leagueId}`, options);
	}

	public getLocations(options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APILocationList>(`/locations?${query}`, options);
	}

	public getLocation(locationId: number, options?: OverrideOptions) {
		return this.handler.request<APILocation>(`/locations/${locationId}`, options);
	}

	public getClanRanks(locationId: number | string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APIClanRankingList>(`/locations/${locationId}/rankings/clans?${query}`, options);
	}

	public getPlayerRanks(locationId: number | string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APIPlayerRankingList>(`/locations/${locationId}/rankings/players?${query}`, options);
	}

	public getVersusClanRanks(locationId: number | string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APIClanVersusRankingList>(`/locations/${locationId}/rankings/clans-versus?${query}`, options);
	}

	public getVersusPlayerRanks(locationId: number | string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APIPlayerVersusRankingList>(`/locations/${locationId}/rankings/players-versus?${query}`, options);
	}

	public getClanLabels(options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APILabelList>(`/labels/clans?${query}`, options);
	}

	public getPlayerLabels(options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APILabelList>(`/labels/players?${query}`, options);
	}

	public getGoldPassSeason(options?: OverrideOptions) {
		return this.handler.request<APIGoldPassSeason>('/goldpass/seasons/current', options);
	}
}
