import { ClanSearchOptions, SearchOptions, ClientOptions, InitOptions, OverrideOptions } from '../rest/RequestHandler';
import { LEGEND_LEAGUE_ID, EVENTS } from '../util/Constants';
import { RESTManager } from '../rest/RESTManager';
import { EventManager } from './EventManager';
import { HTTPError } from '../rest/HTTPError';
import { EventEmitter } from 'events';
import { Util } from '../util/Util';

import {
	Clan,
	ClanMember,
	ClanWar,
	ClanWarLog,
	League,
	Location,
	Player,
	WarLeague,
	RankedClan,
	RankedPlayer,
	Label,
	GoldPassSeason,
	ClanWarLeagueGroup
} from '../struct';

/**
 * Represents Clash of Clans API Client.
 * @example
 * ```js
 * const { Client } = require('clashofclans.js');
 * const client = new Client({ keys: ['***'] });
 * ```
 */
export class Client extends EventEmitter {
	/** Event Manager for the client. */
	public readonly events: EventManager;

	/** REST Handler of the client. */
	public readonly rest: RESTManager;

	public constructor(options?: ClientOptions) {
		super();

		this.rest = new RESTManager(options);
		this.events = new EventManager(this);
	}

	/** Contains various general-purpose utility methods. */
	public get util(): typeof Util {
		return Util;
	}

	/**
	 * Initialize the client to create keys.
	 * @example
	 * ```
	 * const client = new Client();
	 * client.login({ email: 'developer@email.com', password: '***' });
	 * ```
	 */
	public login(options: InitOptions) {
		return this.rest.handler.init(options);
	}

	/** Set Clash of Clans API keys. */
	public setKeys(keys: string[]) {
		this.rest.handler.setKeys(keys);
		return this;
	}

	/** Search all clans by name and/or filtering the results using various criteria. */
	public async getClans(options: ClanSearchOptions) {
		const { data } = await this.rest.getClans(options);
		// @ts-expect-error
		return data.items.map((clan) => new Clan(this, clan));
	}

	/** Get information about a clan. */
	public async getClan(clanTag: string, options?: OverrideOptions) {
		const { data } = await this.rest.getClan(clanTag, options);
		return new Clan(this, data);
	}

	/** Get list of clan members. */
	public async getClanMembers(clanTag: string, options?: SearchOptions) {
		const { data } = await this.rest.getClanMembers(clanTag, options);
		return data.items.map((entry) => new ClanMember(this, entry));
	}

	/** Get clan war log. */
	public async getClanWarLog(clanTag: string, options?: SearchOptions) {
		const { data } = await this.rest.getClanWarLog(clanTag, options);
		return data.items.map((entry) => new ClanWarLog(this, entry));
	}

	/** Get info about currently running war (regular or friendly) in the clan. */
	public async getClanWar(clanTag: string, options?: OverrideOptions) {
		const { data, maxAge } = await this.rest.getCurrentWar(clanTag, options);
		if (data.state === 'notInWar') return null;
		return new ClanWar(this, data, { clanTag, maxAge });
	}

	/** Get info about currently running war in the clan. */
	public async getCurrentWar(clanTag: string, options?: OverrideOptions): Promise<ClanWar | null> {
		try {
			const data = await this.getClanWar(clanTag, options);
			return data ?? (await this.getLeagueWar(clanTag));
		} catch (e) {
			if (e instanceof HTTPError && e.status === 403) {
				return this.getLeagueWar(clanTag);
			}
		}

		return null;
	}

	/** Get information about a CWL round. */
	public async getLeagueWar(clanTag: string, warState?: keyof typeof CWLRound) {
		const state = (warState && CWLRound[warState]) ?? 'inWar'; // eslint-disable-line
		const data = await this.getClanWarLeagueGroup(clanTag);

		const rounds = data.rounds.filter((round) => !round.warTags.includes('#0'));
		if (!rounds.length) return null;

		const num = state === 'preparation' ? -1 : state === 'warEnded' ? -3 : -2;
		const warTags = rounds
			.slice(num)
			.map((round) => round.warTags)
			.flat()
			.reverse();
		const wars = await this.util.allSettled(
			warTags.map((warTag) => this.getClanWarLeagueRound({ warTag, clanTag }, { ignoreRateLimit: true }))
		);

		return wars.find((war) => war?.state === state) ?? wars.at(0) ?? null;
	}

	/** @internal */
	private async _getCurrentLeagueWars(clanTag: string, options?: OverrideOptions) {
		const data = await this.getClanWarLeagueGroup(clanTag, options);
		// @ts-expect-error
		return data._getCurrentWars(clanTag);
	}

	/** @internal */
	private async _getClanWars(clanTag: string, options?: OverrideOptions) {
		const date = new Date().getDate();
		try {
			const data = await this.getClanWar(clanTag, options);
			if (!(date >= 1 && date <= 10)) return data ? [data] : [];
			return data ? [data] : await this._getCurrentLeagueWars(clanTag);
		} catch (e) {
			if (!(date >= 1 && date <= 10)) return [];
			if (e instanceof HTTPError && e.status === 403) {
				return this._getCurrentLeagueWars(clanTag);
			}
			return [];
		}
	}

	/** Get information about clan war league. */
	public async getClanWarLeagueGroup(clanTag: string, options?: OverrideOptions) {
		const { data } = await this.rest.getClanWarLeagueGroup(clanTag, options);
		return new ClanWarLeagueGroup(this, data);
	}

	/** Get information about CWL round by WarTag. */
	public async getClanWarLeagueRound(warTag: string | { warTag: string; clanTag?: string }, options?: OverrideOptions) {
		const args = typeof warTag === 'string' ? { warTag } : { warTag: warTag.warTag, clanTag: warTag.clanTag };
		const { data, maxAge } = await this.rest.getClanWarLeagueRound(args.warTag, options);
		if (data.state === 'notInWar') return null;
		return new ClanWar(this, data, { warTag: args.warTag, clanTag: args.clanTag, maxAge });
	}

	/** Get information about a player by tag. */
	public async getPlayer(playerTag: string, options?: OverrideOptions) {
		const { data } = await this.rest.getPlayer(playerTag, options);
		return new Player(this, data);
	}

	/** Verify Player API token that can be found from the Game settings. */
	public async verifyPlayerToken(playerTag: string, token: string, options?: OverrideOptions) {
		const { data } = await this.rest.postPlayerToken(playerTag, token, options);
		return data.status === 'ok';
	}

	/** Get list of Leagues. */
	public async getLeagues(options?: SearchOptions) {
		const { data } = await this.rest.getLeagues(options);
		return data.items.map((entry) => new League(entry));
	}

	/** Get Legend League season Ids. */
	public async getLeagueSeasons(options?: SearchOptions) {
		const { data } = await this.rest.getLeagueSeasons(LEGEND_LEAGUE_ID, options);
		return data.items.map((league) => league.id);
	}

	/** Get Legend League season rankings by season Id. */
	public async getSeasonRankings(seasonId: string, options?: SearchOptions) {
		const { data } = await this.rest.getSeasonRankings(LEGEND_LEAGUE_ID, seasonId, options);
		// @ts-expect-error
		return data.items.map((entry) => new RankedPlayer(entry));
	}

	/** Get list of Clan War Leagues. */
	public async getWarLeagues(options?: SearchOptions) {
		const { data } = await this.rest.getWarLeagues(options);
		return data.items.map((entry) => new WarLeague(entry));
	}

	/** Get list of Locations. */
	public async getLocations(options?: SearchOptions) {
		const { data } = await this.rest.getLocations(options);
		return data.items.map((entry) => new Location(entry));
	}

	/** Get clan rankings for a specific location. */
	public async getClanRanks(locationId: number | 'global', options?: SearchOptions) {
		const { data } = await this.rest.getClanRanks(locationId, options);
		return data.items.map((entry) => new RankedClan(entry));
	}

	/** Get player rankings for a specific location. */
	public async getPlayerRanks(locationId: number | 'global', options?: SearchOptions) {
		const { data } = await this.rest.getPlayerRanks(locationId, options);
		return data.items.map((entry) => new RankedPlayer(this, entry));
	}

	/** Get clan versus rankings for a specific location */
	public async getVersusClanRanks(locationId: number | 'global', options?: SearchOptions) {
		const { data } = await this.rest.getVersusClanRanks(locationId, options);
		return data.items.map((entry) => new RankedClan(entry));
	}

	/** Get player versus rankings for a specific location */
	public async getVersusPlayerRanks(locationId: number | 'global', options?: SearchOptions) {
		const { data } = await this.rest.getVersusPlayerRanks(locationId, options);
		return data.items.map((entry) => new RankedPlayer(this, entry));
	}

	/** Get list of clan labels. */
	public async getClanLabels(options?: SearchOptions) {
		const { data } = await this.rest.getClanLabels(options);
		return data.items.map((entry) => new Label(entry));
	}

	/** Get list of player labels. */
	public async getPlayerLabels(options?: SearchOptions) {
		const { data } = await this.rest.getPlayerLabels(options);
		return data.items.map((entry) => new Label(entry));
	}

	/** Get information about gold pass season. */
	public async getGoldPassSeason(options?: OverrideOptions) {
		const { data } = await this.rest.getGoldPassSeason(options);
		return new GoldPassSeason(data);
	}

	// #region typings
	/* eslint-disable @typescript-eslint/prefer-readonly */

	/**
	 * Emits when maintenance break starts in the API.
	 * @public
	 * @event
	 */
	private static maintenanceStart: string;

	/**
	 * Emits when maintenance break ends in the API.
	 *
	 * **Parameters**
	 *
	 * | Name | Type | Description |
	 * | :--: | :--: | :---------: |
	 * | `duration` | `number` | Duration of the maintenance break in milliseconds. |
	 * @public
	 * @event
	 */
	private static maintenanceEnd: string;

	/**
	 * Emits when a new season starts.
	 *
	 * **Parameters**
	 *
	 * | Name | Type | Description |
	 * | :--: | :--: | :---------: |
	 * | `id` | `string` | Id of the new season. |
	 * @public
	 * @event
	 */
	private static newSeasonStart: string;

	/* eslint-disable @typescript-eslint/prefer-readonly */

	/** @internal */
	public on<K extends keyof ClientEvents>(event: K, listeners: (...args: ClientEvents[K]) => void): this;
	/** @internal */ // @ts-expect-error
	public on<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listeners: (...args: any[]) => void): this;

	/** @internal */
	public once<K extends keyof ClientEvents>(event: K, listeners: (...args: ClientEvents[K]) => void): this;
	/** @internal */ // @ts-expect-error
	public once<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listeners: (...args: any[]) => void): this;

	/** @internal */
	public emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean;
	/** @internal */ // @ts-expect-error
	public emit<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, ...args: any[]): boolean;
	// #endregion typings
}

export interface ClientEvents {
	[EVENTS.NEW_SEASON_START]: [id: string];
	[EVENTS.MAINTENANCE_START]: [];
	[EVENTS.MAINTENANCE_END]: [duration: number];
	[EVENTS.CLAN_LOOP_START]: [];
	[EVENTS.CLAN_LOOP_END]: [];
	[EVENTS.PLAYER_LOOP_START]: [];
	[EVENTS.PLAYER_LOOP_END]: [];
	[EVENTS.WAR_LOOP_START]: [];
	[EVENTS.WAR_LOOP_END]: [];
	[EVENTS.ERROR]: [error: unknown];
}

export interface EventTypes {
	CLAN: [oldClan: Clan, newClan: Clan];
	PLAYER: [oldPlayer: Player, newPlayer: Player];
	CLAN_WAR: [oldWar: ClanWar, newWar: ClanWar];
}

export const CWLRound = {
	PREVIOUS_WAR: 'warEnded',
	CURRENT_WAR: 'inWar',
	NEXT_WAR: 'preparation'
} as const;
