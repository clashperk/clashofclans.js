import { RESTManager, ClanSearchOptions, SearchOptions } from '../rest/RESTManager';
import { ClientOptions } from '../rest/RequestHandler';
import Util from '../util/Util';

import {
	Clan,
	ClanMember,
	ClanWar,
	ClanWarLeagueGroup,
	ClanWarLog,
	League,
	Location,
	Player,
	WarLeague,
	RankedClan,
	RankedPlayer,
	Label,
	GoldPassSeason
} from '../struct';

export class Client {
	private readonly rest: RESTManager;
	public readonly util = Util;

	public constructor(options?: ClientOptions) {
		this.rest = new RESTManager(options);
	}

	/** Set Clash of Clans API keys. */
	public setkeys(keys: string[]) {
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
	public async getClan(clanTag: string) {
		const { data } = await this.rest.getClan(clanTag);
		return new Clan(this, data);
	}

	/** Get list of clan members. */
	public async getClanMembers(clanTag: string, options: SearchOptions) {
		const { data } = await this.rest.getClanMembers(clanTag, options);
		return data.items.map((entry) => new ClanMember(this, entry));
	}

	/** Get clan war log. */
	public async getClanWarLog(clanTag: string, options: SearchOptions) {
		const { data } = await this.rest.getClanWarLog(clanTag, options);
		return data.items.map((entry) => new ClanWarLog(this, entry));
	}

	/** Get information about currently running war in the clan. */
	public async getCurrentWar(clanTag: string) {
		const { data } = await this.rest.getCurrentWar(clanTag);
		return new ClanWar(this, clanTag, data);
	}

	/** Get information about clan war league. */
	public async getClanWarLeagueGroup(clanTag: string) {
		const { data } = await this.rest.getClanWarLeagueGroup(clanTag);
		return new ClanWarLeagueGroup(this, data);
	}

	/** Get information about CWL round by WarTag. */
	public async getClanWarLeagueRound(clanTag: string) {
		const { data } = await this.rest.getClanWarLeagueRound(clanTag);
		return new ClanWar(this, clanTag, data);
	}

	/** Get information about a player by tag. */
	public async getPlayer(playerTag: string) {
		const { data } = await this.rest.getPlayer(playerTag);
		return new Player(this, data);
	}

	/** Verify Player API token that can be found from the Game settings. */
	public async verifyPlayerToken(playerTag: string, token: string) {
		const { data } = await this.rest.postPlayerToken(playerTag, token);
		return data.status === 'ok';
	}

	/** Get list of Leagues. */
	public async getLeagues(options?: SearchOptions) {
		const { data } = await this.rest.getLeagues(options);
		return data.items.map((entry) => new League(entry));
	}

	/** Get Legend League season Ids. */
	public async getLeagueSeasons(options?: SearchOptions) {
		const { data } = await this.rest.getLeagueSeasons(29000022, options);
		return data.items.map((league) => league.id);
	}

	/** Get Legend League season rankings by season Id. */
	public async getSeasonRankings(seasonId: string, options?: SearchOptions) {
		const { data } = await this.rest.getSeasonRankings(29000022, seasonId, options);
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
		return data.items.map((entry) => new RankedPlayer(entry));
	}

	/** Get clan versus rankings for a specific location */
	public async getVersusClanRanks(locationId: number | 'global', options?: SearchOptions) {
		const { data } = await this.rest.getVersusClanRanks(locationId, options);
		return data.items.map((entry) => new RankedClan(entry));
	}

	/** Get player versus rankings for a specific location */
	public async getVersusPlayerRanks(locationId: number | 'global', options?: SearchOptions) {
		const { data } = await this.rest.getVersusPlayerRanks(locationId, options);
		return data.items.map((entry) => new RankedPlayer(entry));
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
	public async getGoldPassSeason() {
		const { data } = await this.rest.getGoldPassSeason();
		return new GoldPassSeason(data);
	}
}
