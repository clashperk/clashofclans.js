import { EventEmitter } from 'node:events';
import { ClanSearchOptions, SearchOptions, ClientOptions, LoginOptions, OverrideOptions } from '../types';
import { LegendLeagueId, CWLRounds, RestEvents, ClientEvents } from '../util/Constants';
import { HTTPError } from '../rest/HTTPError';
import { RESTManager } from '../rest/RESTManager';
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
import { CapitalRaidSeason } from '../struct/CapitalRaidSeason';

interface IClientEvents {
	[ClientEvents.Error]: [error: unknown];
	[ClientEvents.Debug]: [path: string, status: string, message: string];
}

export interface Client {
	emit: (<K extends keyof IClientEvents>(event: K, ...args: IClientEvents[K]) => boolean) &
		(<S extends string | symbol>(event: Exclude<S, keyof IClientEvents>, ...args: any[]) => boolean);

	off: (<K extends keyof IClientEvents>(event: K, listener: (...args: IClientEvents[K]) => void) => this) &
		(<S extends string | symbol>(event: Exclude<S, keyof IClientEvents>, listener: (...args: any[]) => void) => this);

	on: (<K extends keyof IClientEvents>(event: K, listener: (...args: IClientEvents[K]) => void) => this) &
		(<S extends string | symbol>(event: Exclude<S, keyof IClientEvents>, listener: (...args: any[]) => void) => this);

	once: (<K extends keyof IClientEvents>(event: K, listener: (...args: IClientEvents[K]) => void) => this) &
		(<S extends string | symbol>(event: Exclude<S, keyof IClientEvents>, listener: (...args: any[]) => void) => this);

	removeAllListeners: (<K extends keyof IClientEvents>(event?: K) => this) &
		(<S extends string | symbol>(event?: Exclude<S, keyof IClientEvents>) => this);

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
}

/**
 * Represents Clash of Clans API Client.
 * ```js
 * const { Client } = require('clashofclans.js');
 * const client = new Client({ keys: ['***'] });
 * ```
 */
export class Client extends EventEmitter {
	/** REST Handler of the client. */
	public rest: RESTManager;

	public constructor(options?: ClientOptions) {
		super();

		this.rest = new RESTManager({ ...options, rejectIfNotValid: true })
			.on(RestEvents.Debug, this.emit.bind(this, RestEvents.Debug))
			.on(RestEvents.Error, this.emit.bind(this, RestEvents.Error));
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
	public login(options: LoginOptions) {
		return this.rest.requestHandler.init(options);
	}

	/** Set Clash of Clans API keys. */
	public setKeys(keys: string[]) {
		this.rest.requestHandler.setKeys(keys);
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

	/** Get capital raid seasons. */
	public async getCapitalRaidSeasons(tag: string, options?: SearchOptions) {
		const { data } = await this.rest.getCapitalRaidSeasons(tag, options);
		return data.items.map((entry) => new CapitalRaidSeason(entry));
	}

	/** Get clan war log. */
	public async getClanWarLog(clanTag: string, options?: SearchOptions) {
		const { data } = await this.rest.getClanWarLog(clanTag, options);
		return data.items.map((entry) => new ClanWarLog(this, entry));
	}

	/** Get info about currently running war (normal or friendly) in the clan. */
	public async getClanWar(clanTag: string, options?: OverrideOptions) {
		const { data, maxAge } = await this.rest.getCurrentWar(clanTag, options);
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
	public async getCurrentWar(clanTag: string | { clanTag: string; round?: keyof typeof CWLRounds }, options?: OverrideOptions) {
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
	public async getLeagueWar(clanTag: string | { clanTag: string; round?: keyof typeof CWLRounds }, options?: OverrideOptions) {
		const args = typeof clanTag === 'string' ? { clanTag } : { clanTag: clanTag.clanTag, round: clanTag.round };

		const state = (args.round && CWLRounds[args.round]) ?? 'inWar'; // eslint-disable-line
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

		if (args.round && args.round in CWLRounds) {
			return wars.find((war) => war.clan.tag === args.clanTag && war.state === state) ?? null;
		}

		return (
			wars.find((war) => war.clan.tag === args.clanTag && war.state === state) ??
			wars.find((war) => war.clan.tag === args.clanTag) ??
			null
		);
	}

	/** Returns active wars (last 2) of the CWL group. */
	public async getLeagueWars(clanTag: string, options?: OverrideOptions) {
		const data = await this.getClanWarLeagueGroup(clanTag, options);
		return data.getCurrentWars(clanTag, options);
	}

	/** Returns active wars (last 2 for CWL) of the clan. */
	public async getWars(clanTag: string, options?: OverrideOptions) {
		const date = new Date().getUTCDate();
		if (!(date >= 1 && date <= 10)) {
			return [await this.getClanWar(clanTag, options)];
		}

		try {
			return await this.getLeagueWars(clanTag, options);
		} catch (e) {
			if (e instanceof HTTPError && [404].includes(e.status)) {
				return [await this.getClanWar(clanTag, options)];
			}
			throw e;
		}
	}

	/** Get info about clan war league. */
	public async getClanWarLeagueGroup(clanTag: string, options?: OverrideOptions) {
		const { data } = await this.rest.getClanWarLeagueGroup(clanTag, options);
		return new ClanWarLeagueGroup(this, data);
	}

	/** Get info about a CWL round by WarTag. */
	public async getClanWarLeagueRound(warTag: string | { warTag: string; clanTag?: string }, options?: OverrideOptions) {
		const args = typeof warTag === 'string' ? { warTag } : { warTag: warTag.warTag, clanTag: warTag.clanTag };
		const { data, maxAge } = await this.rest.getClanWarLeagueRound(args.warTag, options);
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
		const { data } = await this.rest.getLeagueSeasons(LegendLeagueId, options);
		return data.items.map((league) => league.id);
	}

	/** Get Legend League season rankings by season Id. */
	public async getSeasonRankings(seasonId: string, options?: SearchOptions) {
		const { data } = await this.rest.getSeasonRankings(LegendLeagueId, seasonId, options);
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
}
