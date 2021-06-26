const { Extension } = require('../util/Extension');
const fetch = require('node-fetch');
const qs = require('querystring');

/**
 * Represents Base Client
 * @class
 * @example
 * const { Client } = require('clashofclans.js');
 */
class Client {
	/**
	 * Represents Clash of Clans API
	 *
	 * In order to access the API, you need a developer account and a key for your application.
	 *
	 * {@link https://developer.clashofclans.com}
	 * @param {ClientOptions} [options={}] - Client Options
	 * @example
	 * const { Client } = require('clashofclans.js');
	 * const client = new Client({ keys: ['API_KEY'] });
	 */
	constructor(options = {}) {
		this._tokenIndex = 0;
		this.timeout = options.timeout || 0;
		this.keys = options.keys || options.token;
		this.baseURL = options.baseURL || 'https://api.clashofclans.com/v1';
	}

	/**
	 * Initialize Extension class and create keys
	 * @param {ExtensionOptions} options Required extension options.
	 * @returns {string[]} Created Tokens
	 * @example
	 * const { Client } = require('clashofclans.js');
	 * const client = new Client();
	 * (async () => {
	 *		await client.init({ email: '', password: '' });
	 *		// you would have to run the `init` method just for once.
	 *
	 *		const data = await client.clan('#2PP');
	 *		console.log(data);
	 * })();
	 */
	async init(options = {}) {
		this.keys = [];

		const ext = new Extension({
			email: options.email,
			keyName: options.keyName,
			password: options.password,
			keyCount: options.keyCount,
			keyDescription: options.keyDescription
		});

		return ext.login().then(() => {
			this.keys = ext.keys;
			return ext.keys;
		});
	}

	get _tokens() {
		return Array.isArray(this.keys) ? [...this.keys] : [this.keys];
	}

	get _token() {
		const token = this._tokens[this._tokenIndex];
		this._tokenIndex = (this._tokenIndex + 1) >= this._tokens.length ? 0 : this._tokenIndex + 1;
		return token;
	}

	async fetch(path) {
		const res = await fetch(`${this.baseURL}${path}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${this._token}`,
				Accept: 'application/json'
			},
			timeout: Number(this.timeout)
		}).catch(() => null);

		return this.toJSON(res);
	}

	async toJSON(res) {
		const parsed = await res?.json().catch(() => null);
		if (!parsed) return { ok: false, statusCode: res?.status ?? 504, maxAge: 0 };

		const maxAge = res?.headers.get('cache-control')?.split('=')?.[1] ?? 0;
		return Object.assign(parsed, { statusCode: res?.status ?? 504, ok: res?.status === 200, maxAge: Number(maxAge) * 1000 });
	}

	/**
	 * Parse a clan or player Tag
	 * @param {string} tag Tag of clans or players
	 * @throws {TypeError} The "tag" argument must be of type string
	 * @returns {string} Fixed Tag
	 * @example
	 * // Fix Lowercase, Zero and Missing Hash #
	 * client.parseTag('PccVqqGO'); // #PCCVQQG0
	 */
	parseTag(tag) {
		if (tag && typeof tag === 'string') {
			return `#${tag.toUpperCase().replace(/O|o/g, '0').replace(/^#/g, '')}`;
		}
		throw TypeError('The "tag" argument must be of type string.');
	}

	encodeTag(tag) {
		return encodeURIComponent(this.parseTag(tag));
	}

	/**
	 * Search clans
	 * @param {ClanSearchOptions} [options={}] - Search clans by name or filtering parameters.
	 *
	 * **- If name is used as part of search query, it needs to be at least three characters long.**
	 *
	 * **- Name search parameter is interpreted as wild card search, so it may appear anywhere in the clan name.**
	 * @example
	 * client.clans({ name: 'air hounds', limit: 10 });
	 * // or
	 * client.clans({ minMembers: 40, maxMembers: 50 });
	 * @returns {Promise<Object>} Object
	 */
	async clans(options) {
		const query = qs.stringify(options);
		return this.fetch(`/clans?${query}`);
	}

	/**
	 * Get clan information
	 * @param {string} clanTag - Tag of the clan.
	 * @example
	 * client.clan('#8QU8J9LP');
	 * @returns {Promise<Object>} Object
	 */
	async clan(clanTag) {
		return this.fetch(`/clans/${this.encodeTag(clanTag)}`);
	}

	/**
	 * List clan members
	 * @param {string} clanTag - Tag of the clan.
	 * @param {SearchOptions} [options={}] - Optional options
	 * @example
	 * client.clanMembers('#8QU8J9LP', { limit: 10 });
	 * @returns {Promise<Object>} Object
	 */
	async clanMembers(clanTag, options) {
		const query = qs.stringify(options);
		return this.fetch(`/clans/${this.encodeTag(clanTag)}/members?${query}`);
	}

	/**
	 * Detailed clan members
	 * @param {Array.<{ tag: string }>} members - List of members
	 * @example
	 * const data = await client.clan('#8QU8J9LP');
	 * client.detailedClanMembers(data.memberList);
	 * @returns {Promise<Object>} Player Objects
	 */
	async detailedClanMembers(members) {
		return Promise.all(members.map(mem => this.player(mem.tag)));
	}

	/**
	 * Retrieve clan's clan war log
	 * @param {string} clanTag - Tag of the clan.
	 * @param {SearchOptions} [options={}] - Optional options
	 * @example
	 * client.clanWarLog('#8QU8J9LP', { limit: 10 });
	 * @returns {Promise<Object>} Object
	 */
	async clanWarLog(clanTag, options) {
		const query = qs.stringify(options);
		return this.fetch(`/clans/${this.encodeTag(clanTag)}/warlog?${query}`);
	}

	/**
	 * Retrieve information about clan's current clan war
	 * @param {string} clanTag - Tag of the clan.
	 * @param {SearchOptions} [options={}] - Optional options
	 * @example
	 * client.currentClanWar('#8QU8J9LP');
	 * @returns {Promise<Object>} Object
	 */
	async currentClanWar(clanTag, options) {
		const query = qs.stringify(options);
		return this.fetch(`/clans/${this.encodeTag(clanTag, true)}/currentwar?${query}`);
	}

	/**
	 * Retrieve information about clan's current clan war league group
	 * @param {string} clanTag - Tag of the clan.
	 * @example
	 * client.clanWarLeague('#8QU8J9LP');
	 * @returns {Promise<Object>} Object
	 */
	async clanWarLeague(clanTag) {
		return this.fetch(`/clans/${this.encodeTag(clanTag)}/currentwar/leaguegroup`);
	}

	/**
	 * Retrieve information about individual clan war league war
	 * @param {string} warTag - WarTag of a CWL round.
	 * @example
	 * client.clanWarLeagueWar('#2QJQPYLJU');
	 * @returns {Promise<Object>} Object
	 */
	async clanWarLeagueWar(warTag) {
		return this.fetch(`/clanwarleagues/wars/${this.encodeTag(warTag)}`);
	}

	/**
	 * Get player information.
	 * @param {string} playerTag - Tag of the player.
	 * @example
	 * client.player('#9Q92C8R20');
	 * @returns {Promise<Object>} Object
	 */
	async player(playerTag) {
		return this.fetch(`/players/${this.encodeTag(playerTag)}`);
	}

	/**
	 * Verify player API token that can be found from the game settings. This API call can be used to check that players own the game accounts they claim to own as they need to provide the one-time use API token that exists inside the game.
	 * @param {string} playerTag Tag of the player.
	 * @param {string} token Player API token.
	 * @example
	 * client.verifyPlayerToken('#9Q92C8R20', 'pd3NN9x2');
	 * @returns {Promise<Object>} Object
	 */
	async verifyPlayerToken(playerTag, token) {
		const res = await fetch(`${this.baseURL}/players/${this.encodeTag(playerTag)}/verifytoken`, {
			method: 'POST',
			body: JSON.stringify({ token }),
			headers: {
				Authorization: `Bearer ${this._token}`,
				Accept: 'application/json'
			},
			timeout: Number(this.timeout)
		}).catch(() => null);

		return this.toJSON(res);
	}

	/**
	 * List Leagues
	 * @param {SearchOptions} [options={}] - Optional options
	 * @example
	 * client.leagues();
	 * @returns {Promise<Object>} Object
	 */
	async leagues(options) {
		const query = qs.stringify(options);
		return this.fetch(`/leagues?${query}`);
	}

	/**
	 * Get league information
	 * @param {string} leagueId - Identifier of the league.
	 * @example
	 * client.league('29000022');
	 * @returns {Promise<Object>} Object
	 */
	async league(leagueId) {
		return this.fetch(`/leagues/${leagueId}`);
	}

	/**
	 * Get league seasons. Note that league season information is available only for Legend League.
	 * @param {string} leagueId - Identifier of the league.
	 * @param {SearchOptions} [options={}] - Optional options
	 * @example
	 * client.leagueSeason('29000022', { limit: 10 });
	 * @returns {Promise<Object>} Object
	 */
	async leagueSeason(leagueId, options) {
		const query = qs.stringify(options);
		return this.fetch(`/leagues/${leagueId}/seasons?${query}`);
	}

	/**
	 * Get league season rankings. Note that league season information is available only for Legend League.
	 * @param {string} leagueId - Identifier of the league.
	 * @param {string} seasonId - Identifier of the season.
	 * @param {SearchOptions} [options={}] - Optional options
	 * @example
	 * client.leagueRanking('29000022', '2020-03', { limit: 10 });
	 * @returns {Promise<Object>} Object
	 */
	async leagueRanking(leagueId, seasonId, options) {
		const query = qs.stringify(options);
		return this.fetch(`/leagues/${leagueId}/seasons/${seasonId}?${query}`);
	}

	/**
	 * List war leagues
	 * @param {SearchOptions} [options={}] - Optional options
	 * @example
	 * client.warLeagues();
	 * @returns {Promise<Object>} Object
	 */
	async warLeagues(options) {
		const query = qs.stringify(options);
		return this.fetch(`/warleagues?${query}`);
	}

	/**
	 * Get war league information
	 * @param {string} leagueId - Identifier of the league.
	 * @example
	 * client.warLeague('48000018');
	 * @returns {Promise<Object>} Object
	 */
	async warLeague(leagueId) {
		return this.fetch(`/warleagues/${leagueId}`);
	}

	/**
	 * List locations
	 * @param {SearchOptions} [options={}] - Optional options
	 * @example
	 * client.locations();
	 * // OR
	 * client.locations({ limit: 10 });
	 * @returns {Promise<Object>} Object
	 */
	async locations(options) {
		const query = qs.stringify(options);
		return this.fetch(`/locations?${query}`);
	}

	/**
	 * Get information about specific location
	 * @param {string} locationId - Identifier of the location to retrieve.
	 * @example
	 * client.location('32000107');
	 * @returns {Promise<Object>} Object
	 */
	async location(locationId) {
		return this.fetch(`/locations/${locationId}`);
	}

	/**
	 * Get clan rankings for a specific location
	 * @param {string|'global'} locationId - Identifier of the location to retrieve.
	 * @param {SearchOptions} [options={}] - Optional options
	 * @example
	 * client.clanRanks('32000107', { limit: 10 });
	 * @returns {Promise<Object>} Object
	 */
	async clanRanks(locationId, options) {
		const query = qs.stringify(options);
		return this.fetch(`/locations/${locationId}/rankings/clans?${query}`);
	}

	/**
	 * Get player rankings for a specific location
	 * @param {string|'global'} locationId - Identifier of the location to retrieve.
	 * @param {SearchOptions} [options={}] - Optional options
	 * @example
	 * client.playerRanks('32000107', { limit: 10 });
	 * @returns {Promise<Object>} Object
	 */
	async playerRanks(locationId, options) {
		const query = qs.stringify(options);
		return this.fetch(`/locations/${locationId}/rankings/players?${query}`);
	}

	/**
	 * Get clan versus rankings for a specific location
	 * @param {string|'global'} locationId - Identifier of the location to retrieve.
	 * @param {SearchOptions} [options={}] - Optional options
	 * @example
	 * client.versusClanRanks('32000107', { limit: 10 });
	 * @returns {Promise<Object>} Object
	 */
	async versusClanRanks(locationId, options) {
		const query = qs.stringify(options);
		return this.fetch(`/locations/${locationId}/rankings/clans-versus?${query}`);
	}

	/**
	 * Get player versus rankings for a specific location
	 * @param {string|'global'} locationId - Identifier of the location to retrieve.
	 * @param {SearchOptions} [options={}] - Optional options
	 * @example
	 * client.versusPlayerRanks('32000107', { limit: 10 });
	 * @returns {Promise<Object>} Object
	 */
	async versusPlayerRanks(locationId, options) {
		const query = qs.stringify(options);
		return this.fetch(`/locations/${locationId}/rankings/players-versus?${query}`);
	}

	/**
	 * List clan labels
	 * @param {SearchOptions} [options={}] - Optional options
	 * @example
	 * client.clanLabels();
	 * @returns {Promise<Object>} Object
	 */
	async clanLabels(options) {
		const query = qs.stringify(options);
		return this.fetch(`/labels/clans?${query}`);
	}

	/**
	 * List player labels
	 * @param {SearchOptions} [options={}] - Optional options
	 * @example
	 * client.playerLabels();
	 * @returns {Promise<Object>} Object
	 */
	async playerLabels(options) {
		const query = qs.stringify(options);
		return this.fetch(`/labels/players?${query}`);
	}

	/**
	 * Get information about the current gold pass season.
	 * @returns {Promise<Object>} Object
	 */
	async goldPassSeason() {
		return this.fetch('/goldpass/seasons/current');
	}
}

module.exports = Client;

/**
 * TypeDefs
 * @namespace core
 */

/**
 * Base Client Options
 * @typedef {Object} ClientOptions
 * @memberof core
 * @property {string|string[]} token - Clash of Clans API token
 * @property {number} timeout - Request timeout in millisecond
 * @property {string} [baseURL] - Clash of Clans API Base URL
 */

/**
 * Clan Search Options
 *
 * **- If name is used as part of search query, it needs to be at least three characters long.**
 *
 * **- Name search parameter is interpreted as wild card search, so it may appear anywhere in the clan name.**
 * @typedef {Object} ClanSearchOptions
 * @memberof core
 * @property {string} name - Search clans by name.
 * @property {string} warFrequency - Filter by clan war frequency
 * @property {string} locationId - Filter by clan location identifier. For list of available locations, refer to getLocations operation
 * @property {number} minMembers - Filter by minimum number of clan members
 * @property {number} maxMembers - Filter by maximum number of clan members
 * @property {number} minClanPoints - Filter by minimum amount of clan points.
 * @property {number} minClanLevel - Filter by minimum clan level.
 * @property {number} limit - Limit the number of items returned in the response.
 * @property {string} after - Return only items that occur after this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both.
 * @property {string} before - Return only items that occur before this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both.
 * @property {string} labelIds - Comma separatered list of label IDs to use for filtering results.
 */

/**
 * Search Options
 * @typedef {Object} SearchOptions
 * @memberof core
 * @property {number} limit - Limit the number of items returned in the response.
 * @property {string} after - Return only items that occur after this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both.
 * @property {string} before - Return only items that occur before this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both.
 */
