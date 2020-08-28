declare module 'clashofclans.js' {
	/**
	 * Client Options
	 */
	interface ClientOption {
		/**
		 * Clash of Clans API Token
		 */
		token?: string;
		/**
		 * Request timeout in millisecond
		 */
		timeout?: number | 0;
		/**
		 * Clash of Clans API base URL
		 */
		baseURL?: string | 'https://api.clashofclans.com/v1'
	}

	/**
	 * Fetch Options
	 */
	interface FetchOption {
		/**
		 * Clash of Clans API Token
		 */
		token?: string;
		/**
		 * Request timeout in millisecond
		 */
		timeout?: number | 0;
	}

	/**
	 * Clan Search Options
	 */
	interface ClanSearchOption {
		/**
		 * Search clans by name. If name is used as part of search query, it needs to be at least three characters long. Name search parameter is interpreted as wild card search, so it may appear anywhere in the clan name.
		 */
		name?: string;
		/**
		 * Filter by clan war frequency
		 */
		warFrequency?: string;
		/**
		 * Filter by clan location identifier. For list of available locations, refer to getLocations operation
		 */
		locationId?: string;
		/**
		 * Filter by minimum number of clan members
		 */
		minMembers?: number;
		/**
		 * Filter by maximum number of clan members
		 */
		maxMembers?: number;
		/**
		 * Filter by minimum amount of clan points.
		 */
		minClanPoints?: number;
		/**
		 * Filter by minimum clan level.
		 */
		minClanLevel?: number;
		/**
		 * Limit the number of items returned in the response.
		 */
		limit?: number;
		/**
		 * Return only items that occur after this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both.
		 */
		after?: string;
		/**
		 * Return only items that occur before this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both.
		 */
		before?: string;
		/**
		 * Comma separatered list of label IDs to use for filtering results.
		 */
		labelIds?: string;
	}

	/**
	 * Search Options
	 */
	interface SearchOption {
		/**
		 * Limit the number of items returned in the response.
		 */
		limit?: number;
		/**
		 * Return only items that occur after this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both.
		 */
		after?: string;
		/**
		 * Return only items that occur before this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both.
		 */
		before?: string;
	}

	export class Client {
		/**
		 * Represents Clash of Clans API
		 * @param {ClientOption} option - API Options
		 * @example
		 * const { Client } = require('clashofclans.js');
		 * const client = new Client({ token: '', timeout: 5000 });
		 */
		constructor(option?: ClientOption);
		/**
		 * Clash of Clans API Token
		 */
		public token?: string;
		/**
		 * Request timeout in millisecond
		 */
		public timeout?: number | 0;
		/**
		 * Clash of Clans API base URL
		 */
		public baseURL?: string | 'https://api.clashofclans.com/v1';

		/**
		 * Fetch any URL
		 * @param {string} reqURL Request URL
		 * @param {FetchOption} option Fetch options (optional)
		 * @example
		 * client.fetch(reqURL, { token, timeout });
		 * @returns {Promise<Object>} Object
		 */
		public fetch(reqURL?: string, option?: FetchOption): Promise<object>;

		/**
		 * Search clans
		 * @param {string} name Search clans by name or filtering parameters. If name is used as part of search query, it needs to be at least three characters long. Name search parameter is interpreted as wild card search, so it may appear anywhere in the clan name.
		 * @example
		 * client.clans('air hounds');
		 * // or
		 * client.clans({ name: 'air hounds', limit: 10 });
		 * // or
		 * client.clans({ minMembers: 40, maxMembers: 50 });
		 * @returns {Promise<Object>} Object
		 */
		public clans(clan?: string | ClanSearchOption): Promise<object>;

		/**
		 * Get clan information
		 * @param {string} clanTag Tag of the clan.
		 * @example
		 * client.clan('#8QU8J9LP');
		 * @returns {Promise<Object>} Object
		 */
		public clan(clanTag?: string): Promise<object>;

		/**
		 * List clan members
		 * @param {string} clanTag Tag of the clan.
		 * @param {SearchOption} option Search options (optional)
		 * @example
		 * client.clanMembers('#8QU8J9LP', { limit: 10 });
		 * @returns {Promise<Object>} Object
		 */
		public clanMembers(clanTag?: string, option?: SearchOption): Promise<object>;

		/**
		 * Retrieve clan's clan war log
		 * @param {string} clanTag Tag of the clan.
		 * @param {SearchOption} option Search options (optional)
		 * @example
		 * client.clanWarlog('#8QU8J9LP', { limit: 10 });
		 * @returns {Promise<Object>} Object
		 */
		public clanWarlog(clanTag?: string, option?: SearchOption): Promise<object>;

		/**
		 * Retrieve information about clan's current clan war
		 * @param {string} clanTag Tag of the clan.
		 * @param {SearchOption} option Search options (optional)
		 * @example
		 * client.currentWar('#8QU8J9LP');
		 * @returns {Promise<Object>} Object
		 */
		public currentWar(clanTag?: string, option?: SearchOption): Promise<object>;

		/**
		 * Retrieve information about clan's current clan war league group
		 * @param {string} clanTag Tag of the clan.
		 * @example
		 * client.clanWarLeague('#8QU8J9LP');
		 * @returns {Promise<Object>} Object
		 */
		public clanWarLeague(clanTag?: string): Promise<object>;

		/**
		 * Retrieve information about individual clan war league war
		 * @param {string} warTag WarTag of a CWL round.
		 * @example
		 * client.clanWarLeagueWarTags('#2QJQPYLJU');
		 * @returns {Promise<Object>} Object
		 */
		public clanWarLeagueWarTags(warTag?: string): Promise<object>;

		/**
		 * Get player information.
		 * @param {string} playerTag Tag of the player.
		 * @example
		 * client.player('#9Q92C8R20');
		 * @returns {Promise<Object>} Object
		 */
		public player(playerTag?: string): Promise<object>;

		/**
		 * List Leagues
		 * @param {SearchOption} option Search options (optional)
		 * @example
		 * client.leagues();
		 * @returns {Promise<Object>} Object
		 */
		public leagues(option?: SearchOption): Promise<object>;

		/**
		 * Get league information
		 * @param {string} leagueId Identifier of the league.
		 * @example
		 * client.leagueId('29000022');
		 * @returns {Promise<Object>} Object
		 */
		public leagueId(leagueId?: string): Promise<object>;

		/**
		 * Get league seasons. Note that league season information is available only for Legend League.
		 * @param {string} leagueId Identifier of the league.
		 * @param {SearchOption} option Search options (optional)
		 * @example
		 * client.leagueSeasons('29000022', { limit: 10 });
		 * @returns {Promise<Object>} Object
		 */
		public leagueSeasons(leagueId?: string, option?: SearchOption): Promise<object>;

		/**
		 * Get league season rankings. Note that league season information is available only for Legend League.
		 * @param {string} leagueId Identifier of the league.
		 * @param {string} seasonId Identifier of the season.
		 * @param {SearchOption} option Search options (optional)
		 * @example
		 * client.leagueRanking('29000022', '2020-03', { limit: 10 });
		 * @returns {Promise<Object>} Object
		 */
		public leagueRanking(leagueId?: string, seasonId?: string, option?: SearchOption): Promise<object>;

		/**
		 * List war leagues
		 * @param {SearchOption} option Search options (optional)
		 * @example
		 * client.warLeagues();
		 * @returns {Promise<Object>} Object
		 */
		public warLeagues(option?: SearchOption): Promise<object>;

		/**
		 * Get war league information
		 * @param {string} leagueId Identifier of the league.
		 * @example
		 * client.warLeagueId('48000018');
		 * @returns {Promise<Object>} Object
		 */
		public warLeagueId(leagueId?: string): Promise<object>;

		/**
		 * List locations
		 * @param {SearchOption} option Search options (optional)
		 * @example
		 * client.locations();
		 * // OR
		 * client.locations({ limit: 10 });
		 * @returns {Promise<Object>} Object
		 */
		public locations(option?: SearchOption): Promise<object>;

		/**
		 * Get information about specific location
		 * @param {string} locationId Identifier of the location to retrieve.
		 * @example
		 * client.locationId('32000107');
		 * @returns {Promise<Object>} Object
		 */
		public locationId(locationId?: string): Promise<object>;

		/**
		 * Get clan rankings for a specific location
		 * @param {string} locationId Identifier of the location to retrieve.
		 * @param {SearchOption} option Search options (optional)
		 * @example
		 * client.clanRanks('32000107', { limit: 10 });
		 * @returns {Promise<Object>} Object
		 */
		public clanRanks(locationId?: string, option?: SearchOption): Promise<object>;

		/**
		 * Get player rankings for a specific location
		 * @param {string} locationId Identifier of the location to retrieve.
		 * @param {SearchOption} option Search options (optional)
		 * @example
		 * client.playerRanks('32000107', { limit: 10 });
		 * @returns {Promise<Object>} Object
		 */
		public playerRanks(locationId?: string, option?: SearchOption): Promise<object>;

		/**
		 * Get clan versus rankings for a specific location
		 * @param {string} locationId Identifier of the location to retrieve.
		 * @param {SearchOption} option Search options (optional)
		 * @example
		 * client.versusClanRanks('32000107', { limit: 10 });
		 * @returns {Promise<Object>} Object
		 */
		public versusClanRanks(locationId?: string, option?: SearchOption): Promise<object>;

		/**
		 * Get player versus rankings for a specific location
		 * @param {string} locationId Identifier of the location to retrieve.
		 * @param {SearchOption} option Search options (optional)
		 * @example
		 * client.versusPlayerRanks('32000107', { limit: 10 });
		 * @returns {Promise<Object>} Object
		 */
		public versusPlayerRanks(locationId?: string, option?: SearchOption): Promise<object>;

		/**
		 * List clan labels
		 * @param {SearchOption} option Search options (optional)
		 * @example
		 * client.clanLabels();
		 * @returns {Promise<Object>} Object
		 */
		public clanLabels(option?: SearchOption): Promise<object>;

		/**
		 * List player labels
		 * @param {SearchOption} option Search options (optional)
		 * @example
		 * client.playerLabels();
		 * @returns {Promise<Object>} Object
		 */
		public playerLabels(option?: SearchOption): Promise<object>;
	}
}