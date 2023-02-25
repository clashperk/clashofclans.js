import { EventEmitter } from 'node:events';
import { Util } from '../util/Util';
import {
	APIClan,
	APIClanList,
	APIClanMemberList,
	APICapitalRaidSeasons,
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
	LoginOptions,
	APICapitalLeagueList,
	APICapitalLeague,
	APIClanCapitalRankingList
} from '../types';
import { RestEvents } from '../util/Constants';
import { RequestHandler } from './RequestHandler';

export interface IRestEvents {
	[RestEvents.Error]: [error: unknown];
	[RestEvents.Debug]: [path: string, status: number, message: string];
	[RestEvents.RateLimited]: [path: string, status: number, message: string];
}

export interface RESTManager {
	emit: (<K extends keyof IRestEvents>(event: K, ...args: IRestEvents[K]) => boolean) &
		(<S extends string | symbol>(event: Exclude<S, keyof IRestEvents>, ...args: any[]) => boolean);

	off: (<K extends keyof IRestEvents>(event: K, listener: (...args: IRestEvents[K]) => void) => this) &
		(<S extends string | symbol>(event: Exclude<S, keyof IRestEvents>, listener: (...args: any[]) => void) => this);

	on: (<K extends keyof IRestEvents>(event: K, listener: (...args: IRestEvents[K]) => void) => this) &
		(<S extends string | symbol>(event: Exclude<S, keyof IRestEvents>, listener: (...args: any[]) => void) => this);

	once: (<K extends keyof IRestEvents>(event: K, listener: (...args: IRestEvents[K]) => void) => this) &
		(<S extends string | symbol>(event: Exclude<S, keyof IRestEvents>, listener: (...args: any[]) => void) => this);

	removeAllListeners: (<K extends keyof IRestEvents>(event?: K) => this) &
		(<S extends string | symbol>(event?: Exclude<S, keyof IRestEvents>) => this);

	/**
	 * Emitted for general debugging information.
	 * @public
	 * @event
	 */
	debug: string;

	/**
	 * Emitted when the client encounters an error.
	 * @public
	 * @event
	 */
	error: string;

	/**
	 * Emitted when the client is rate limited.
	 * @public
	 * @event
	 */
	rateLimited: string;
}

/** Represents a REST Manager of the client. */
export class RESTManager extends EventEmitter {
	/** Request Handler for the RESTManager. */
	public requestHandler: RequestHandler;

	public constructor(options?: RESTOptions) {
		super();

		this.requestHandler = new RequestHandler(options)
			.on(RestEvents.Debug, this.emit.bind(this, RestEvents.Debug))
			.on(RestEvents.Error, this.emit.bind(this, RestEvents.Error))
			.on(RestEvents.RateLimited, this.emit.bind(this, RestEvents.RateLimited));
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
		return this.requestHandler.init(options);
	}

	/** Set Clash of Clans API keys. */
	public setKeys(keys: string[]) {
		this.requestHandler.setKeys(keys);
		return this;
	}

	/** Search all clans by name and/or filtering the results using various criteria. */
	public getClans(query: ClanSearchOptions, options?: OverrideOptions) {
		return this.requestHandler.request<APIClanList>(`/clans${Util.queryString(query)}`, options);
	}

	/** Get info about a clan. */
	public getClan(clanTag: string, options?: OverrideOptions) {
		return this.requestHandler.request<APIClan>(`/clans/${Util.encodeURI(clanTag)}`, options);
	}

	/** Get list of clan members. */
	public getClanMembers(clanTag: string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.requestHandler.request<APIClanMemberList>(`/clans/${Util.encodeURI(clanTag)}/members${query}`, options);
	}

	/** Get clan war log. */
	public getClanWarLog(clanTag: string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.requestHandler.request<APIClanWarLog>(`/clans/${Util.encodeURI(clanTag)}/warlog${query}`, options);
	}

	/** Get info about currently running war in the clan. */
	public getCurrentWar(clanTag: string, options?: OverrideOptions) {
		return this.requestHandler.request<APIClanWar>(`/clans/${Util.encodeURI(clanTag)}/currentwar`, options);
	}

	/** Get info about clan war league. */
	public getClanWarLeagueGroup(clanTag: string, options?: OverrideOptions) {
		return this.requestHandler.request<APIClanWarLeagueGroup>(`/clans/${Util.encodeURI(clanTag)}/currentwar/leaguegroup`, options);
	}

	/** Get info about a CWL round by WarTag. */
	public getClanWarLeagueRound(warTag: string, options?: OverrideOptions) {
		return this.requestHandler.request<APIClanWar>(`/clanwarleagues/wars/${Util.encodeURI(warTag)}`, options);
	}

	/** Retrieve clan's capital raid seasons. */
	public getCapitalRaidSeasons(tag: string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.requestHandler.request<APICapitalRaidSeasons>(`/clans/${Util.encodeURI(tag)}/capitalraidseasons${query}`, options);
	}

	/** Get info about a player by tag. */
	public getPlayer(playerTag: string, options?: OverrideOptions) {
		return this.requestHandler.request<APIPlayer>(`/players/${Util.encodeURI(playerTag)}`, options);
	}

	/** Verify Player API token that can be found from the Game settings. */
	public verifyPlayerToken(playerTag: string, token: string, options?: OverrideOptions) {
		const opts = { method: 'POST', body: JSON.stringify({ token }), ...options };
		return this.requestHandler.request<APIVerifyToken>(`/players/${Util.encodeURI(playerTag)}/verifytoken`, opts);
	}

	/** Get a list of Leagues. */
	public getLeagues(options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.requestHandler.request<APILeagueList>(`/leagues${query}`, options);
	}

	/** Get a League info. */
	public getLeague(leagueId: string | number, options?: OverrideOptions) {
		return this.requestHandler.request<APILeague>(`/leagues/${leagueId}`, options);
	}

	/** Get a list of Capital leagues. */
	public getCapitalLeagues(options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.requestHandler.request<APICapitalLeagueList>(`/capitalleagues${query}`, options);
	}

	/** Get a Capital League info. */
	public getCapitalLeague(leagueId: string | number, options?: OverrideOptions) {
		return this.requestHandler.request<APICapitalLeague>(`/capitalleagues/${leagueId}`, options);
	}

	/** Get Legend League season Ids. */
	public getLeagueSeasons(leagueId: number, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.requestHandler.request<APILeagueSeasonList>(`/leagues/${leagueId}/seasons${query}`, options);
	}

	/** Get Legend League season rankings by season Id. */
	public getSeasonRankings(leagueId: number, seasonId: string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.requestHandler.request<APIPlayerSeasonRankingList>(`/leagues/${leagueId}/seasons/${seasonId}${query}`, options);
	}

	/** Get list of Clan War Leagues. */
	public getWarLeagues(options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.requestHandler.request<APIWarLeagueList>(`/warleagues${query}`, options);
	}

	/** Get info about a Clan War League. */
	public getWarLeague(leagueId: number, options?: OverrideOptions) {
		return this.requestHandler.request<APIWarLeague>(`/warleagues/${leagueId}`, options);
	}

	/** Get list of Locations. */
	public getLocations(options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.requestHandler.request<APILocationList>(`/locations${query}`, options);
	}

	/** Get info about a Location. */
	public getLocation(locationId: number, options?: OverrideOptions) {
		return this.requestHandler.request<APILocation>(`/locations/${locationId}`, options);
	}

	/** Get clan rankings for a specific location. */
	public getClanRanks(locationId: number | string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.requestHandler.request<APIClanRankingList>(`/locations/${locationId}/rankings/clans${query}`, options);
	}

	/** Get player rankings for a specific location. */
	public getPlayerRanks(locationId: number | string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.requestHandler.request<APIPlayerRankingList>(`/locations/${locationId}/rankings/players${query}`, options);
	}

	/** Get clan versus rankings for a specific location. */
	public getVersusClanRanks(locationId: number | string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.requestHandler.request<APIClanVersusRankingList>(`/locations/${locationId}/rankings/clans-versus${query}`, options);
	}

	/** Get player versus rankings for a specific location. */
	public getVersusPlayerRanks(locationId: number | string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.requestHandler.request<APIPlayerVersusRankingList>(`/locations/${locationId}/rankings/players-versus${query}`, options);
	}

	/** Get clan capital rankings for a specific location. */
	public getClanCapitalRanks(locationId: number | string, options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.requestHandler.request<APIClanCapitalRankingList>(`/locations/${locationId}/rankings/capitals${query}`, options);
	}

	/** Get list of clan labels. */
	public getClanLabels(options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.requestHandler.request<APILabelList>(`/labels/clans${query}`, options);
	}

	/** Get list of player labels. */
	public getPlayerLabels(options?: SearchOptions) {
		const query = Util.queryString(options);
		return this.requestHandler.request<APILabelList>(`/labels/players${query}`, options);
	}

	/** Get info about gold pass season. */
	public getGoldPassSeason(options?: OverrideOptions) {
		return this.requestHandler.request<APIGoldPassSeason>('/goldpass/seasons/current', options);
	}
}
