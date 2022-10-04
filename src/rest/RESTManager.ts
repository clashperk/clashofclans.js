import { Util } from '../util/Util';
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
	APIWarLeagueList,
	SearchOptions,
	ClanSearchOptions,
	RESTOptions,
	OverrideOptions,
	LoginOptions
} from '../types';
import { RequestHandler } from './RequestHandler';

/** Represents a REST Manager of the client. */
export class RESTManager {
	/** Request Handler for the RESTManager. */
	public handler: RequestHandler;

	public constructor(options?: RESTOptions) {
		this.handler = new RequestHandler(options);
	}

	/** Contains various general-purpose utility methods. */
	public get util(): typeof Util {
		return Util;
	}

	/**
	 * Initialize the client to create keys.
	 * @example
	 * ```
	 * const rest = new RESTManager();
	 * rest.login({ email: 'developer@email.com', password: '***' });
	 * ```
	 */
	public login(options: LoginOptions) {
		return this.handler.init(options);
	}

	/** Set Clash of Clans API keys. */
	public setKeys(keys: string[]) {
		this.handler.setKeys(keys);
		return this;
	}

	/** Search all clans by name and/or filtering the results using various criteria. */
	public getClans(query: ClanSearchOptions, options?: OverrideOptions) {
		return this.handler.request<APIClanList>(`/clans${Util.queryString(query)}`, options);
	}

	/** Get info about a clan. */
	public getClan(clanTag: string, options?: OverrideOptions) {
		return this.handler.request<APIClan>(`/clans/${Util.encodeURI(clanTag)}`, options);
	}

	/** Get list of clan members. */
	public getClanMembers(clanTag: string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APIClanMemberList>(`/clans/${Util.encodeURI(clanTag)}/members${query}`, options);
	}

	/** Get clan war log. */
	public getClanWarLog(clanTag: string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APIClanWarLog>(`/clans/${Util.encodeURI(clanTag)}/warlog${query}`, options);
	}

	/** Get info about currently running war in the clan. */
	public getCurrentWar(clanTag: string, options?: OverrideOptions) {
		return this.handler.request<APIClanWar>(`/clans/${Util.encodeURI(clanTag)}/currentwar`, options);
	}

	/** Get info about clan war league. */
	public getClanWarLeagueGroup(clanTag: string, options?: OverrideOptions) {
		return this.handler.request<APIClanWarLeagueGroup>(`/clans/${Util.encodeURI(clanTag)}/currentwar/leaguegroup`, options);
	}

	/** Get info about a CWL round by WarTag. */
	public getClanWarLeagueRound(warTag: string, options?: OverrideOptions) {
		return this.handler.request<APIClanWar>(`/clanwarleagues/wars/${Util.encodeURI(warTag)}`, options);
	}

	/** Get info about a player by tag. */
	public getPlayer(playerTag: string, options?: OverrideOptions) {
		return this.handler.request<APIPlayer>(`/players/${Util.encodeURI(playerTag)}`, options);
	}

	/** Verify Player API token that can be found from the Game settings. */
	public verifyPlayerToken(playerTag: string, token: string, options?: OverrideOptions) {
		const opts = { method: 'POST', body: JSON.stringify({ token }), ...options };
		return this.handler.request<APIVerifyToken>(`/players/${Util.encodeURI(playerTag)}/verifytoken`, opts);
	}

	/** Get list of Leagues. */
	public getLeagues(options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APILeagueList>(`/leagues${query}`, options);
	}

	/** Get a League info. */
	public getLeague(leagueId: string | number, options?: OverrideOptions) {
		return this.handler.request<APILeague>(`/leagues/${leagueId}`, options);
	}

	/** Get Legend League season Ids. */
	public getLeagueSeasons(leagueId: number, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APILeagueSeasonList>(`/leagues/${leagueId}/seasons${query}`, options);
	}

	/** Get Legend League season rankings by season Id. */
	public getSeasonRankings(leagueId: number, seasonId: string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APIPlayerSeasonRankingList>(`/leagues/${leagueId}/seasons/${seasonId}${query}`, options);
	}

	/** Get list of Clan War Leagues. */
	public getWarLeagues(options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APIWarLeagueList>(`/warleagues${query}`, options);
	}

	/** Get info about a Clan War League. */
	public getWarLeague(leagueId: number, options?: OverrideOptions) {
		return this.handler.request<APIWarLeague>(`/warleagues/${leagueId}`, options);
	}

	/** Get list of Locations. */
	public getLocations(options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APILocationList>(`/locations${query}`, options);
	}

	/** Get info about a Location. */
	public getLocation(locationId: number, options?: OverrideOptions) {
		return this.handler.request<APILocation>(`/locations/${locationId}`, options);
	}

	/** Get clan rankings for a specific location. */
	public getClanRanks(locationId: number | string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APIClanRankingList>(`/locations/${locationId}/rankings/clans${query}`, options);
	}

	/** Get player rankings for a specific location. */
	public getPlayerRanks(locationId: number | string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APIPlayerRankingList>(`/locations/${locationId}/rankings/players${query}`, options);
	}

	/** Get clan versus rankings for a specific location. */
	public getVersusClanRanks(locationId: number | string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APIClanVersusRankingList>(`/locations/${locationId}/rankings/clans-versus${query}`, options);
	}

	/** Get player versus rankings for a specific location. */
	public getVersusPlayerRanks(locationId: number | string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APIPlayerVersusRankingList>(`/locations/${locationId}/rankings/players-versus${query}`, options);
	}

	/** Get list of clan labels. */
	public getClanLabels(options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APILabelList>(`/labels/clans${query}`, options);
	}

	/** Get list of player labels. */
	public getPlayerLabels(options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.handler.request<APILabelList>(`/labels/players${query}`, options);
	}

	/** Get info about gold pass season. */
	public getGoldPassSeason(options?: OverrideOptions) {
		return this.handler.request<APIGoldPassSeason>('/goldpass/seasons/current', options);
	}
}
