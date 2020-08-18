const Error = require('./Error');
const qs = require('querystring');
const https = require('https');
const { parse } = require('url');

/**
 * Represents Clash of Clans API
 * @param {ClientOption} option - API Options
 * @example
 * const { Client } = require('clashofclans.js');
 * const client = new Client({ token: '', timeout: 5000 });
 */
class Client {
	constructor(option = {}) {
		this.token = option.token;
		this.timeout = option.timeout;
		this.baseURL = 'https://api.clashofclans.com/v1';
	}

	/**
	 * Fetch any URL
	 * @param {string} reqURL - Request URL
	 * @param {Object} options - Optional options
	 * @example
	 * client.fetch(reqURL, { token, timeout }).then(data => console.log(data)));
	 * @returns {Promise<Object>} Object
	 */
	async fetch(reqURL, { token = this.token, timeout = this.timeout } = {}) {
		return new Promise((resolve, reject) => {
			const response = {
				raw: '',
				status: null,
				headers: null
			};

			const { hostname, path } = parse(reqURL);
			const options = {
				hostname,
				path,
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				timeout: typeof timeout === 'number' ? timeout : 0
			};

			const request = https.request(options, res => {
				response.status = res.statusCode;
				response.headers = res.headers;
				response.ok = res.statusCode === 200;

				res.on('data', chunk => {
					response.raw += chunk;
				});

				res.on('end', () => {
					if (res.headers['content-type'] && res.headers['content-type'].includes('application/json')) {
						try {
							const parsed = JSON.parse(response.raw);
							resolve(Object.assign(parsed, {
								status: response.status,
								ok: response.ok,
								maxAge: Math.floor(response.headers['cache-control'].split('=')[1])
							}));
						} catch {
							reject(new Error(500));
						}
					} else {
						reject(new Error(500));
					}
				});
			});

			request.on('error', () => {
				reject(new Error(500));
			});

			request.on('timeout', () => {
				reject(new Error(504));
				request.destroy();
			});

			request.end();
		});
	}

	static tag(tag) {
		if (tag && typeof tag === 'string') {
			return encodeURIComponent(`#${tag.toUpperCase().replace(/O|o/g, '0').replace(/^#/g, '')}`);
		}
		throw TypeError(`The "tag" argument must be of type string. Received type ${typeof tag === 'string' ? 'empty string' : typeof tag}.`);
	}

	/**
	 * Search clans
	 * @param {string} name - Search clans by name. If name is used as part of search query, it needs to be at least three characters long. Name search parameter is interpreted as wild card search, so it may appear anywhere in the clan name.
	 * @param {ClanSearchOption} option - Optional options
	 * @example
	 * client.clans('air hounds', { limit: 10 });
	 * @returns {Promise<Object>} Object
	 */
	async clans(name, option) {
		const query = qs.stringify(option);
		return this.fetch(`${this.baseURL}/clans?name=${encodeURIComponent(name)}&${query}`);
	}

	/**
	 * Get clan information
	 * @param {string} clanTag - Tag of the clan.
	 * @example
	 * client.clan('#8QU8J9LP');
	 * @returns {Promise<Object>} Object
	 */
	async clan(clanTag) {
		return this.fetch(`${this.baseURL}/clans/${this.constructor.tag(clanTag)}`);
	}

	/**
	 * List clan members
	 * @param {string} clanTag - Tag of the clan.
	 * @param {SearchOption} option - Optional options
	 * @example
	 * client.clanMembers('#8QU8J9LP', { limit: 10 });
	 * @returns {Promise<Object>} Object
	 */
	async clanMembers(clanTag, option) {
		const query = qs.stringify(option);
		return this.fetch(`${this.baseURL}/clans/${this.constructor.tag(clanTag)}/members?${query}`);
	}

	/**
	 * Retrieve clan's clan war log
	 * @param {string} clanTag - Tag of the clan.
	 * @param {SearchOption} option - Optional options
	 * @example
	 * client.clanWarlog('#8QU8J9LP', { limit: 10 });
	 * @returns {Promise<Object>} Object
	 */
	async clanWarlog(clanTag, option) {
		const query = qs.stringify(option);
		return this.fetch(`${this.baseURL}/clans/${this.constructor.tag(clanTag)}/warlog?${query}`);
	}

	/**
	 * Retrieve information about clan's current clan war
	 * @param {string} clanTag - Tag of the clan.
	 * @param {SearchOption} option - Optional options
	 * @example
	 * client.currentWar('#8QU8J9LP');
	 * @returns {Promise<Object>} Object
	 */
	async currentWar(clanTag, option) {
		const query = qs.stringify(option);
		return this.fetch(`${this.baseURL}/clans/${this.constructor.tag(clanTag)}/currentwar?${query}`);
	}

	/**
	 * Retrieve information about clan's current clan war league group
	 * @param {string} clanTag - Tag of the clan.
	 * @example
	 * client.clanWarLeague('#8QU8J9LP');
	 * @returns {Promise<Object>} Object
	 */
	async clanWarLeague(clanTag) {
		return this.fetch(`${this.baseURL}/clans/${this.constructor.tag(clanTag)}/currentwar/leaguegroup`);
	}

	/**
	 * Retrieve information about individual clan war league war
	 * @param {string} warTag - WarTag of a CWL round.
	 * @example
	 * client.clanWarLeagueWarTags('#2QJQPYLJU');
	 * @returns {Promise<Object>} Object
	 */
	async clanWarLeagueWarTags(warTag) {
		return this.fetch(`${this.baseURL}/clanwarleagues/wars/${this.constructor.tag(warTag)}`);
	}


	/**
	 * Get player information.
	 * @param {string} playerTag - Tag of the player.
	 * @example
	 * client.player('#9Q92C8R20');
	 * @returns {Promise<Object>} Object
	 */
	async player(playerTag) {
		if (typeof playerTag === 'object') {
			const res = [];
			for (const tags of playerTag) {
				res.push(await this.fetch(`${this.baseURL}/players/${this.constructor.tag(tags)}`));
			}
			return res;
		}
		return this.fetch(`${this.baseURL}/players/${this.constructor.tag(playerTag)}`);
	}

	/**
	 * List Leagues
	 * @param {SearchOption} option - Optional options
	 * @example
	 * client.leagues();
	 * @returns {Promise<Object>} Object
	 */
	async leagues(option) {
		const query = qs.stringify(option);
		return this.fetch(`${this.baseURL}/leagues?${query}`);
	}

	/**
	 * Get league information
	 * @param {string} leagueId - Identifier of the league.
	 * @example
	 * client.leagueId('29000022');
	 * @returns {Promise<Object>} Object
	 */
	async leagueId(leagueId) {
		return this.fetch(`${this.baseURL}/leagues/${leagueId}`);
	}

	/**
	 * Get league seasons. Note that league season information is available only for Legend League.
	 * @param {string} leagueId - Identifier of the league.
	 * @param {SearchOption} option - Optional options
	 * @example
	 * client.leagueSeasons('29000022', { limit: 10 });
	 * @returns {Promise<Object>} Object
	 */
	async leagueSeasons(leagueId, option) {
		const query = qs.stringify(option);
		return this.fetch(`${this.baseURL}/leagues/${leagueId}/seasons?${query}`);
	}

	/**
	 * Get league season rankings. Note that league season information is available only for Legend League.
	 * @param {string} leagueId - Identifier of the league.
	 * @param {string} seasonId - Identifier of the season.
	 * @param {SearchOption} option - Optional options
	 * @example
	 * client.leagueRanking('29000022', '2020-03', { limit: 10 });
	 * @returns {Promise<Object>} Object
	 */
	async leagueRanking(leagueId, seasonId, option) {
		const query = qs.stringify(option);
		return this.fetch(`${this.baseURL}/leagues/${leagueId}/seasons/${seasonId}?${query}`);
	}

	/**
	 * List war leagues
	 * @param {SearchOption} option - Optional options
	 * @example
	 * client.warLeagues();
	 * @returns {Promise<Object>} Object
	 */
	async warLeagues(option) {
		const query = qs.stringify(option);
		return this.fetch(`${this.baseURL}/warleagues?${query}`);
	}

	/**
	 * Get war league information
	 * @param {string} leagueId - Identifier of the league.
	 * @example
	 * client.warLeagueId('48000018');
	 * @returns {Promise<Object>} Object
	 */
	async warLeagueId(leagueId) {
		return this.fetch(`${this.baseURL}/warleagues/${leagueId}`);
	}

	/**
	 * List locations
	 * @param {SearchOption} option - Optional options
	 * @example
	 * client.locations();
	 * // OR
	 * client.locations({ limit: 10 });
	 * @returns {Promise<Object>} Object
	 */
	async locations(option) {
		const query = qs.stringify(option);
		return this.fetch(`${this.baseURL}/locations?${query}`);
	}

	/**
	 * Get information about specific location
	 * @param {string} locationId - Identifier of the location to retrieve.
	 * @example
	 * client.locationId('32000107');
	 * @returns {Promise<Object>} Object
	 */
	async locationId(locationId) {
		return this.fetch(`${this.baseURL}/locations/${locationId}`);
	}

	/**
	 * Get clan rankings for a specific location
	 * @param {string} locationId - Identifier of the location to retrieve.
	 * @param {SearchOption} option - Optional options
	 * @example
	 * client.clanRanks('32000107', { limit: 10 });
	 * @returns {Promise<Object>} Object
	 */
	async clanRanks(locationId, option) {
		const query = qs.stringify(option);
		return this.fetch(`${this.baseURL}/locations/${locationId}/rankings/clans?${query}`);
	}

	/**
	 * Get player rankings for a specific location
	 * @param {string} locationId - Identifier of the location to retrieve.
	 * @param {SearchOption} option - Optional options
	 * @example
	 * client.playerRanks('32000107', { limit: 10 });
	 * @returns {Promise<Object>} Object
	 */
	async playerRanks(locationId, option) {
		const query = qs.stringify(option);
		return this.fetch(`${this.baseURL}/locations/${locationId}/rankings/players?${query}`);
	}

	/**
	 * Get clan versus rankings for a specific location
	 * @param {string} locationId - Identifier of the location to retrieve.
	 * @param {SearchOption} option - Optional options
	 * @example
	 * client.versusClanRanks('32000107', { limit: 10 });
	 * @returns {Promise<Object>} Object
	 */
	async versusClanRanks(locationId, option) {
		const query = qs.stringify(option);
		return this.fetch(`${this.baseURL}/locations/${locationId}/rankings/clans-versus?${query}`);
	}

	/**
	 * Get player versus rankings for a specific location
	 * @param {string} locationId - Identifier of the location to retrieve.
	 * @param {SearchOption} option - Optional options
	 * @example
	 * client.versusPlayerRanks('32000107', { limit: 10 });
	 * @returns {Promise<Object>} Object
	 */
	async versusPlayerRanks(locationId, option) {
		const query = qs.stringify(option);
		return this.fetch(`${this.baseURL}/locations/${locationId}/rankings/players-versus?${query}`);
	}

	/**
	 * List clan labels
	 * @param {SearchOption} option - Optional options
	 * @example
	 * client.clanLabels();
	 * @returns {Promise<Object>} Object
	 */
	async clanLabels(option) {
		const query = qs.stringify(option);
		return this.fetch(`${this.baseURL}/labels/clans?${query}`);
	}

	/**
	 * List player labels
	 * @param {SearchOption} option - Optional options
	 * @example
	 * client.playerLabels();
	 * @returns {Promise<Object>} Object
	 */
	async playerLabels(option) {
		const query = qs.stringify(option);
		return this.fetch(`${this.baseURL}/labels/players?${query}`);
	}
}

module.exports = Client;

/**
 * @typedef {Object} ClientOption
 * @param {string} token - Clash of Clans API Token
 * @param {number} timeout - Request timeout in millisecond
 */

/**
 * @typedef {Object} ClanSearchOption
 * @param {string} warFrequency - Filter by clan war frequency
 * @param {string} locationId - Filter by clan location identifier. For list of available locations, refer to getLocations operation
 * @param {number} minMembers - Filter by minimum number of clan members
 * @param {number} maxMembers - Filter by maximum number of clan members
 * @param {number} minClanPoints - Filter by minimum amount of clan points.
 * @param {number} minClanLevel - Filter by minimum clan level.
 * @param {number} limit - Limit the number of items returned in the response.
 * @param {string} after - Return only items that occur after this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both.
 * @param {string} before - Return only items that occur before this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both.
 * @param {string} labelIds - Comma separatered list of label IDs to use for filtering results.
 */

/**
 * @typedef {Object} SearchOption
 * @param {number} limit - Limit the number of items returned in the response.
 * @param {string} after - Return only items that occur after this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both.
 * @param {string} before - Return only items that occur before this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both.
 */
