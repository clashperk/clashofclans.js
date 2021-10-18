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

	public setkeys(keys: string[]) {
		this.rest.handler.setKeys(keys);
		return this;
	}

	public async getClans(options: ClanSearchOptions) {
		const { data } = await this.rest.getClans(options);
		// @ts-expect-error
		return data.items.map((clan) => new Clan(this, clan));
	}

	public async getClan(clanTag: string) {
		const { data } = await this.rest.getClan(clanTag);
		return new Clan(this, data);
	}

	public async getClanMembers(clanTag: string, options: SearchOptions) {
		const { data } = await this.rest.getClanMembers(clanTag, options);
		return data.items.map((entry) => new ClanMember(entry));
	}

	public async getClanWarLog(clanTag: string, options: SearchOptions) {
		const { data } = await this.rest.getClanWarLog(clanTag, options);
		return data.items.map((entry) => new ClanWarLog(this, entry));
	}

	public async getCurrentWar(clanTag: string) {
		const { data } = await this.rest.getCurrentWar(clanTag);
		return new ClanWar(this, data);
	}

	public async getClanWarLeagueGroup(clanTag: string) {
		const { data } = await this.rest.getClanWarLeagueGroup(clanTag);
		return new ClanWarLeagueGroup(this, data);
	}

	public async getClanWarLeagueGrou(clanTag: string) {
		const { data } = await this.rest.getClanWarLeagueWar(clanTag);
		return new ClanWar(this, data);
	}

	public async getPlayer(playerTag: string) {
		const { data } = await this.rest.getPlayer(playerTag);
		return new Player(this, data);
	}

	public async verifyPlayerToken(playerTag: string, token: string) {
		const { data } = await this.rest.postPlayerToken(playerTag, token);
		return data.status === 'ok';
	}

	public async getLeagues(options?: SearchOptions) {
		const { data } = await this.rest.getLeagues(options);
		return data.items.map((entry) => new League(entry));
	}

	/** Only works for Legend League. */
	public async getLeagueSeasons(options?: SearchOptions) {
		const { data } = await this.rest.getLeagueSeasons(29000022, options);
		return data.items.map((league) => league.id);
	}

	public async getSeasonRankings(seasonId: string, options?: SearchOptions) {
		const { data } = await this.rest.getSeasonRankings(29000022, seasonId, options);
		// @ts-expect-error
		return data.items.map((entry) => new RankedPlayer(entry));
	}

	public async getWarLeagues(options?: SearchOptions) {
		const { data } = await this.rest.getWarLeagues(options);
		return data.items.map((entry) => new WarLeague(entry));
	}

	public async getLocations(options?: SearchOptions) {
		const { data } = await this.rest.getLocations(options);
		return data.items.map((entry) => new Location(entry));
	}

	public async getClanRanks(locationId: number | 'global', options?: SearchOptions) {
		const { data } = await this.rest.getClanRanks(locationId, options);
		return data.items.map((entry) => new RankedClan(entry));
	}

	public async getPlayerRanks(locationId: number | 'global', options?: SearchOptions) {
		const { data } = await this.rest.getPlayerRanks(locationId, options);
		return data.items.map((entry) => new RankedPlayer(entry));
	}

	public async getVersusClanRanks(locationId: number | 'global', options?: SearchOptions) {
		const { data } = await this.rest.getVersusClanRanks(locationId, options);
		return data.items.map((entry) => new RankedClan(entry));
	}

	public async getVersusPlayerRanks(locationId: number | 'global', options?: SearchOptions) {
		const { data } = await this.rest.getVersusPlayerRanks(locationId, options);
		return data.items.map((entry) => new RankedPlayer(entry));
	}

	public async getClanLabels(options?: SearchOptions) {
		const { data } = await this.rest.getClanLabels(options);
		return data.items.map((entry) => new Label(entry));
	}

	public async getPlayerLabels(options?: SearchOptions) {
		const { data } = await this.rest.getPlayerLabels(options);
		return data.items.map((entry) => new Label(entry));
	}

	public async getGoldPassSeason() {
		const { data } = await this.rest.getGoldPassSeason();
		return new GoldPassSeason(data);
	}
}
