import { ClanSearchOptions, SearchOptions, ClientOptions, LoginOptions, OverrideOptions } from '../types';
import { LEGEND_LEAGUE_ID, EVENTS, CWL_ROUNDS } from '../util/Constants';
import { HTTPError, NotInWarError } from '../rest/HTTPError';
import { RESTManager } from '../rest/RESTManager';
import { EventManager } from './EventManager';
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
	SeasonRankedPlayer,
	GoldPassSeason,
	ClanWarLeagueGroup
} from '../struct';

/**
 * Represents Clash of Clans API Client.
 * ```js
 * const { Client } = require('clashofclans.js');
 * const client = new Client({ keys: ['***'] });
 * ```
 */
export class Client extends EventEmitter {
	/** Event Manager for the client. */
	public events: EventManager;

	/** REST Handler of the client. */
	public rest: RESTManager;

	public constructor(options?: ClientOptions) {
		super();

		this.rest = new RESTManager({ ...options, rejectIfNotValid: true });
		this.events = new EventManager(this);
	}

	/** Contains various general-purpose utility methods. */
	public get util(): typeof Util {
		return Util;
	}

	/** Whether the API is in maintenance break. */
	public get inMaintenance() {
		// @ts-expect-error
		return this.events._inMaintenance;
	}

	/**
	 * Initialize the client to create keys.
	 * @example
	 * ```
	 * const client = new Client();
	 * client.login({ email: 'developer@email.com', password: '***' });
	 * ```
	 */
	public login(options: LoginOptions) {
		return this.rest.handler.init(options);
	}

	/** Set Clash of Clans API keys. */
	public setKeys(keys: string[]) {
		this.rest.handler.setKeys(keys);
		return this;
	}

	/** Search clans by name and/or filtering parameters or get clans by their tags (fetches in parallel). */
	public async getClans(query: ClanSearchOptions | string[], options?: OverrideOptions) {
		if (Array.isArray(query)) {
			return (await Promise.allSettled(query.map((tag) => this.getClan(tag, options))))
				.filter((res) => res.status === 'fulfilled')
				.map((res) => (res as PromiseFulfilledResult<Clan>).value);
		}
		const { data } = await this.rest.getClans(query, options);
		// @ts-expect-error
		return data.items.map((clan) => new Clan(this, clan));
	}

	/** Get info about a clan. */
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

	/** Get info about currently running war (normal or friendly) in the clan. */
	public async getClanWar(clanTag: string, options?: OverrideOptions) {
		const { data, maxAge, path, status } = await this.rest.getCurrentWar(clanTag, options);
		if (data.state === 'notInWar') {
			throw new HTTPError(NotInWarError, status, path, maxAge);
		}
		return new ClanWar(this, data, { clanTag, maxAge });
	}

	/**
	 * Get info about currently running war in the clan.
	 * @example
	 * ```ts
	 * await client.getCurrentWar('#8QU8J9LP');
	 * ```
	 * @example
	 * ```ts
	 * await client.getCurrentWar({ clanTag: '#8QU8J9LP', round: 'PREVIOUS_ROUND' });
	 * ```
	 */
	public async getCurrentWar(clanTag: string | { clanTag: string; round?: keyof typeof CWL_ROUNDS }, options?: OverrideOptions) {
		const args = typeof clanTag === 'string' ? { clanTag } : { clanTag: clanTag.clanTag, round: clanTag.round };

		try {
			return await this.getClanWar(args.clanTag, options);
		} catch (e) {
			if (e instanceof HTTPError && [200, 403].includes(e.status)) {
				return this.getLeagueWar({ clanTag: args.clanTag, round: args.round }, options);
			}
			throw e;
		}
	}

	/**
	 * Get info about currently running CWL round.
	 * @example
	 * ```ts
	 * await client.getLeagueWar('#8QU8J9LP');
	 * ```
	 * @example
	 * ```ts
	 * await client.getLeagueWar({ clanTag: '#8QU8J9LP', round: 'PREVIOUS_ROUND' });
	 * ```
	 */
	public async getLeagueWar(clanTag: string | { clanTag: string; round?: keyof typeof CWL_ROUNDS }, options?: OverrideOptions) {
		const args = typeof clanTag === 'string' ? { clanTag } : { clanTag: clanTag.clanTag, round: clanTag.round };

		const state = (args.round && CWL_ROUNDS[args.round]) ?? 'inWar'; // eslint-disable-line
		const data = await this.getClanWarLeagueGroup(args.clanTag, options);

		const rounds = data.rounds.filter((round) => !round.warTags.includes('#0'));
		if (!rounds.length) return null;

		const num = state === 'preparation' ? -1 : state === 'warEnded' ? -3 : -2;
		const warTags = rounds
			.slice(num)
			.map((round) => round.warTags)
			.flat()
			.reverse();
		const wars = await this.util.allSettled(
			warTags.map((warTag) => this.getClanWarLeagueRound({ warTag, clanTag: args.clanTag }, { ...options, ignoreRateLimit: true }))
		);

		if (args.round && args.round in CWL_ROUNDS) {
			return wars.find((war) => war.state === state) ?? null;
		}

		return wars.find((war) => war.state === state) ?? wars.at(0) ?? null;
	}

	private async _getCurrentLeagueWars(clanTag: string, options?: OverrideOptions) {
		const data = await this.getClanWarLeagueGroup(clanTag, options);
		// @ts-expect-error
		return data._getCurrentWars(clanTag, options);
	}

	private async _getClanWars(clanTag: string, options?: OverrideOptions) {
		const date = new Date().getUTCDate();
		if (!(date >= 1 && date <= 10)) {
			return [await this.getClanWar(clanTag, options)];
		}

		try {
			return this._getCurrentLeagueWars(clanTag, options);
		} catch (e) {
			if (e instanceof HTTPError && [404].includes(e.status)) {
				return [await this.getClanWar(clanTag, options)];
			}
			throw e;
		}
	}

	/** Get info about clan war league. */
	public async getClanWarLeagueGroup(clanTag: string, options?: OverrideOptions) {
		const { data, status, path, maxAge } = await this.rest.getClanWarLeagueGroup(clanTag, options);
		if (data.state === 'notInWar') {
			throw new HTTPError(NotInWarError, status, path, maxAge);
		}
		return new ClanWarLeagueGroup(this, data);
	}

	/** Get info about a CWL round by WarTag. */
	public async getClanWarLeagueRound(warTag: string | { warTag: string; clanTag?: string }, options?: OverrideOptions) {
		const args = typeof warTag === 'string' ? { warTag } : { warTag: warTag.warTag, clanTag: warTag.clanTag };
		const { data, maxAge, status, path } = await this.rest.getClanWarLeagueRound(args.warTag, options);
		if (data.state === 'notInWar') {
			throw new HTTPError(NotInWarError, status, path, maxAge);
		}
		return new ClanWar(this, data, { warTag: args.warTag, clanTag: args.clanTag, maxAge });
	}

	/** Get info about a player by tag. */
	public async getPlayer(playerTag: string, options?: OverrideOptions) {
		const { data } = await this.rest.getPlayer(playerTag, options);
		return new Player(this, data);
	}

	/** Get info about some players by their tags (fetches in parallel). */
	public async getPlayers(playerTags: string[], options?: OverrideOptions) {
		return (await Promise.allSettled(playerTags.map((tag) => this.getPlayer(tag, options))))
			.filter((res) => res.status === 'fulfilled')
			.map((res) => (res as PromiseFulfilledResult<Player>).value);
	}

	/** Verify Player API token that can be found from the Game settings. */
	public async verifyPlayerToken(playerTag: string, token: string, options?: OverrideOptions) {
		const { data } = await this.rest.verifyPlayerToken(playerTag, token, options);
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
		return data.items.map((entry) => new SeasonRankedPlayer(this, entry));
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

	/**
	 * Get clan rankings for a specific location.
	 *
	 * For global ranking, use `global` as `locationId`.
	 */
	public async getClanRanks(locationId: number | 'global', options?: SearchOptions) {
		const { data } = await this.rest.getClanRanks(locationId, options);
		return data.items.map((entry) => new RankedClan(entry));
	}

	/**
	 * Get player rankings for a specific location.
	 *
	 * For global ranking, use `global` as `locationId`.
	 */
	public async getPlayerRanks(locationId: number | 'global', options?: SearchOptions) {
		const { data } = await this.rest.getPlayerRanks(locationId, options);
		return data.items.map((entry) => new RankedPlayer(this, entry));
	}

	/**
	 * Get clan versus rankings for a specific location.
	 *
	 * For global ranking, use `global` as `locationId`.
	 */
	public async getVersusClanRanks(locationId: number | 'global', options?: SearchOptions) {
		const { data } = await this.rest.getVersusClanRanks(locationId, options);
		return data.items.map((entry) => new RankedClan(entry));
	}

	/**
	 * Get player versus rankings for a specific location.
	 *
	 * For global ranking, use `global` as `locationId`.
	 */
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

	/** Get info about gold pass season. */
	public async getGoldPassSeason(options?: OverrideOptions) {
		const { data } = await this.rest.getGoldPassSeason(options);
		return new GoldPassSeason(data);
	}

	// #region typings
	/* eslint-disable @typescript-eslint/prefer-readonly */

	/**
	 * Emits when a new season starts.
	 *
	 * **Parameters**
	 *
	 * | Name |   Type   | Description           |
	 * | :--: | :------: | :-------------------: |
	 * | `id` | `string` | Id of the new season. |
	 * @public
	 * @event
	 */
	private static newSeasonStart: string;

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
	 * |    Name    |   Type   |                    Description                     |
	 * | :--------: | :------: | :------------------------------------------------: |
	 * | `duration` | `number` | Duration of the maintenance break in milliseconds. |
	 * @public
	 * @event
	 */
	private static maintenanceEnd: string;

	/* eslint-disable @typescript-eslint/prefer-readonly */

	/** @internal */
	public on<K extends keyof ClientEvents>(event: K, listeners: (...args: ClientEvents[K]) => void): this;
	/** @internal */
	public on<S extends keyof CustomEvents>(event: Exclude<S, keyof ClientEvents>, listeners: (...args: CustomEvents[S]) => void): this;
	/** @internal */ // @ts-expect-error
	public on<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listeners: (...args: any[]) => void): this;

	/** @internal */
	public once<K extends keyof ClientEvents>(event: K, listeners: (...args: ClientEvents[K]) => void): this;
	/** @internal */
	public once<S extends keyof CustomEvents>(event: Exclude<S, keyof ClientEvents>, listeners: (...args: CustomEvents[S]) => void): this;
	/** @internal */ // @ts-expect-error
	public once<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listeners: (...args: any[]) => void): this;

	/** @internal */
	public emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean;
	/** @internal */
	public emit<S extends keyof CustomEvents>(event: Exclude<S, keyof ClientEvents>, ...args: CustomEvents[S]): this;
	/** @internal */ // @ts-expect-error
	public emit<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, ...args: any[]): boolean;
	// #endregion typings
}

interface ClientEvents {
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
	[EVENTS.DEBUG]: [path: string, status: string, message: string];
}

// TypeScript 4.5 now can narrow values that have template string types, and also recognizes template string types as discriminants.
interface CustomEvents {
	[key: `clan${string}`]: [oldClan: Clan, newClan: Clan];
	[key: `war${string}`]: [oldWar: ClanWar, newWar: ClanWar];
	[key: `player${string}`]: [oldPlayer: Player, newPlayer: Player];
}
