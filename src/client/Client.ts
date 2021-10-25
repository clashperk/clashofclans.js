import { ClanSearchOptions, SearchOptions, ClientOptions, InitOptions, OverrideOptions } from '../rest/RequestHandler';
import { LEGEND_LEAGUE_ID, EVENTS } from '../util/Constants';
import { RESTManager } from '../rest/RESTManager';
import { HTTPError } from '../rest/HTTPError';
import { EventEmitter } from 'events';
import { Util } from '../util/Util';
import { Event } from './Events';

export const CWLRound = {
	PREVIOUS_WAR: 'warEnded',
	CURRENT_WAR: 'inWar',
	NEXT_WAR: 'preparation'
} as const;

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

/** Represents Clash of Clans API Client. */
export class Client extends EventEmitter {
	public rest: RESTManager;
	public events: Event;

	/**
	 * ```js
	 * const { Client } = require('clashofclans.js');
	 * const client = new Client({ keys: ['***'] });
	 * ```
	 */
	public constructor(options?: ClientOptions) {
		super();

		this.events = new Event(this);
		this.rest = new RESTManager(options);
	}

	/** Contains various general-purpose utility methods. */
	public get util(): typeof Util {
		return Util;
	}

	/**
	 * Initialize the client to create keys.
	 *
	 * ```
	 * const client = new Client();
	 * client.init({ email: 'developer@email.com', password: '***' });
	 * ```
	 */
	public init(options: InitOptions) {
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
		const { data } = await this.rest.getCurrentWar(clanTag, options);
		if (data.state === 'notInWar') return null;
		return new ClanWar(this, data, clanTag);
	}

	/** Get info about currently running war in the clan. */
	public async getCurrentWar(clanTag: string, options?: OverrideOptions): Promise<ClanWar | null> {
		try {
			const data = await this.getClanWar(clanTag, options);
			return data ?? this.getLeagueWar(clanTag);
		} catch (e) {
			if (e instanceof HTTPError && e.status === 403) {
				return this.getLeagueWar(clanTag);
			}
		}

		return null;
	}

	public async getLeagueWar(clanTag: string, warState?: keyof typeof CWLRound) {
		const state = (warState && CWLRound[warState]) || 'inWar'; // eslint-disable-line
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

	/** @private */
	private async _getCurrentLeagueWars(clanTag: string, options?: OverrideOptions) {
		const data = await this.getClanWarLeagueGroup(clanTag, options);
		return data.getCurrentWars(clanTag);
	}

	/** @pri */
	private async _getClanWars(clanTag: string, options?: OverrideOptions) {
		try {
			const { data } = await this.rest.getCurrentWar(clanTag, options);
			if (data.state !== 'notInWar') return [new ClanWar(this, data, clanTag)];
			return this._getCurrentLeagueWars(clanTag);
		} catch (e) {
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
		const { data } = await this.rest.getClanWarLeagueRound(args.warTag, options);
		if (data.state === 'notInWar') return null;
		return new ClanWar(this, data, args.clanTag, args.warTag);
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

	public setEvent<K extends keyof EventTypes>(event: { type: K; name: string; filter: (...args: EventTypes[K]) => boolean }) {
		return this.events.setEvent(event);
	}

	public on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
	public on<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listener: (...args: any[]) => void): this;
	public on(event: string | symbol, listener: (...args: any[]) => void) {
		return super.on(event, listener);
	}
}

export interface ClientEvents {
	[EVENTS.CLAN_MEMBER_JOIN]: [oldClan: Clan, newClan: Clan];
	[EVENTS.CLAN_MEMBER_LEAVE]: [oldClan: Clan, newClan: Clan];
}

export interface EventTypes {
	CLANS: [oldClan: Clan, newClan: Clan];
	PLAYERS: [oldPlayer: Player, newPlayer: Player];
	WARS: [oldWar: ClanWar, newWar: ClanWar];
}
