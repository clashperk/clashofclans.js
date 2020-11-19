import fetch from 'node-fetch';
import qs from 'querystring';

export class Client {

	private token: string;
	private timeout: number;
	private baseUrl: string;

	public constructor(options: ClientOptions) {
		this.token = options.token;
		this.baseUrl = options.baseUrl || 'https://api.clashofclans.com/v1';
		this.timeout = options.timeout || 0;
	}

	public player(playerTag: string) {
		return this.get(`players/${this.parseTag(playerTag)}`);
	}

	public clans(options: string | ClanSearchOptions) {
		const opts: ClanSearchOptions = typeof options === 'string' ? { name: options } : options;
		return this.get('clans', opts);
	}

	public clan(clanTag: string) {
		return this.get(`clans/${this.parseTag(clanTag)}`);
	}

	public clanMembers(clanTag: string, filters?: FilterOptions) {
		return this.get(`clans/${this.parseTag(clanTag)}/members`, filters);
	}

	public clanWar(clanTag: string) {
		return this.get(`clans/${this.parseTag(clanTag)}/currentWar`);
	}

	public clanWarLog(clanTag: string, filters?: FilterOptions) {
		return this.get(`clans/${this.parseTag(clanTag)}/warlog`, filters);
	}

	public clanWarLeague(clanTag: string) {
		return this.get(`clans/${this.parseTag(clanTag)}/currentwar/leaguegroup`);
	}

	public clanWarLeagueWar(warTag: string) {
		return this.get(`clanwarleagues/wars/${this.parseTag(warTag)}`);
	}

	public playerLabels(filters?: FilterOptions) {
		return this.get('labels/players', filters);
	}

	public clanLabels(filters?: FilterOptions) {
		return this.get('labels/clans', filters);
	}

	public locations(filters?: FilterOptions) {
		return this.get('locations', filters);
	}

	public location(locationId: number | string, filters?: FilterOptions) {
		return this.get(`locations/${locationId}`, filters);
	}

	public clanRanks(locationId: number | string, filters?: FilterOptions) {
		return this.get(`locations/${locationId}/rankings/clans`, filters);
	}

	public playerRanks(locationId: number | string, filters?: FilterOptions) {
		return this.get(`locations/${locationId}/rankings/players`, filters);
	}

	public versusClanRanks(locationId: number | string, filters?: FilterOptions) {
		return this.get(`locations/${locationId}/rankings/clans-versus`, filters);
	}

	public versusPlayerRanks(locationId: number | string, filters?: FilterOptions) {
		return this.get(`locations/${locationId}/rankings/players-versus`, filters);
	}

	public leagues(filters?: FilterOptions) {
		return this.get('leagues', filters);
	}

	public league(leagueId: number | string) {
		return this.get(`leagues/${leagueId}`);
	}

	public leagueSeason(leagueId: number | string, filters?: FilterOptions) {
		return this.get(`leagues/${leagueId}/seasons`, filters);
	}

	public leagueRanking(leagueId: number | string, seasonId: number | string) {
		return this.get(`leagues/${leagueId}/seasons/${seasonId}`);
	}

	public warLeagues(filters?: FilterOptions) {
		return this.get('warleagues', filters);
	}

	public warLeague(leagueId: number | string, filters?: FilterOptions) {
		return this.get(`warleagues/${leagueId}`, filters);
	}

	public get(url: string, options?: any) {
		return fetch(`${this.baseUrl}/${url}${this.query(options)}`, {
			headers: {
				'Authorization': `Bearer ${this.token}`,
				'Content-Type': 'application/json'
			},
			timeout: this.timeout
		}).then(res => res.json());
	}

	public parseTag(tag: string): string {
		return encodeURIComponent(`#${tag.toUpperCase().replace(/O/g, '0').replace('#', '')}`);
	}

	private query(opts: any) {
		return opts ? `?${qs.stringify(opts)}` : '';
	}

}

interface ClientOptions {
	baseUrl: string;
	timeout: number;
	token: string;
}

interface FilterOptions {
	limit?: number;
	after?: string;
	before?: string;
}

interface ClanSearchOptions {
	name?: string;
	warFrequency?: string;
	locationId?: string;
	minMembers?: number;
	maxMembers?: number;
	minClanPoints?: number;
	minClanLevel?: number;
	limit?: number;
	after?: number;
	before?: number;
	labelIds?: string;
}
