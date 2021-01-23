declare module 'clashofclans.js' {
	/**
	 * Client Options
	 */
	export interface ClientOptions {
		/**
		 * Clash of Clans API Token
		 */
		token?: string | string[];
		/**
		 * Request timeout in millisecond
		 */
		timeout?: number;
		/**
		 * Clash of Clans API base URL (Or Use Proxy URL)
		 */
		baseURL?: string;
	}

	/**
	 * Clan Search Options
	 */
	export interface ClanSearchOptions {
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
	export interface SearchOptions {
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
		 * @param {ClientOptions} options - API Options
		 * @example
		 * const { Client } = require('clashofclans.js');
		 * const client = new Client({ token: [''], timeout: 5000 });
		 */
		constructor(options?: ClientOptions);
		/**
		 * Clash of Clans API Token
		 */
		public token?: string | string[];
		readonly tokens: string[];
		/**
		 * Request timeout in millisecond
		 */
		public timeout?: number;
		/**
		 * Clash of Clans API base URL
		 */
		public baseURL?: string;

		/**
		 * Fetch any Endpoint
		 * @param {string} path Request Path
		 * @example
		 * client.fetch('/locations').then(data => console.log(data));
		 * @returns {Promise<any>} Object
		 */
		public fetch(path: string): Promise<any>;

		/**
		 * Search clans
		 * @param {string} options Search clans by name or filtering parameters. If name is used as part of search query, it needs to be at least three characters long. Name search parameter is interpreted as wild card search, so it may appear anywhere in the clan name.
		 * @example
		 * client.clans('air hounds');
		 * // or
		 * client.clans({ name: 'air hounds', limit: 10 });
		 * // or
		 * client.clans({ minMembers: 40, maxMembers: 50 });
		 * @returns {Promise<any>} Object
		 */
		public clans(options: string | ClanSearchOptions): Promise<any>;

		/**
		 * Get clan information
		 * @param {string} clanTag Tag of the clan.
		 * @example
		 * client.clan('#8QU8J9LP');
		 * @returns {Promise<any>} Object
		 */
		public clan(clanTag: string): Promise<any>;

		/**
		 * List clan members
		 * @param {string} clanTag Tag of the clan.
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.clanMembers('#8QU8J9LP', { limit: 10 });
		 * @returns {Promise<any>} Object
		 */
		public clanMembers(clanTag: string, options?: SearchOptions): Promise<any>;

		/**
		 * Detailed clan members
		 * @param {{ tag: string }[]} members - List of members
		 * @example
		 * const data = await client.clan('#8QU8J9LP');
		 * client.detailedClanMembers(data.memberList);
		 * @returns {Promise<any[]>} Object
		 */
		public detailedClanMembers(members: { tag: string }[]): Promise<any[]>;

		/**
		 * Retrieve clan's clan war log
		 * @param {string} clanTag Tag of the clan.
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.clanWarLog('#8QU8J9LP', { limit: 10 });
		 * @returns {Promise<any>} Object
		 */
		public clanWarLog(clanTag: string, options?: SearchOptions): Promise<any>;

		/**
		 * Retrieve information about clan's current clan war
		 * @param {string} clanTag Tag of the clan.
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.currentClanWar('#8QU8J9LP');
		 * @returns {Promise<any>} Object
		 */
		public currentClanWar(clanTag: string, options?: SearchOptions): Promise<any>;

		/**
		 * Retrieve information about clan's current clan war league group
		 * @param {string} clanTag Tag of the clan.
		 * @example
		 * client.clanWarLeague('#8QU8J9LP');
		 * @returns {Promise<any>} Object
		 */
		public clanWarLeague(clanTag: string): Promise<any>;

		/**
		 * Retrieve information about individual clan war league war
		 * @param {string} warTag WarTag of a CWL round.
		 * @example
		 * client.clanWarLeagueWar('#2QJQPYLJU');
		 * @returns {Promise<any>} Object
		 */
		public clanWarLeagueWar(warTag: string): Promise<any>;

		/**
		 * Get player information.
		 * @param {string} playerTag Tag of the player.
		 * @example
		 * client.player('#9Q92C8R20');
		 * @returns {Promise<any>} Object
		 */
		public player(playerTag: string): Promise<any>;

		/**
		 * Verify player API token that can be found from the game settings. This API call can be used to check that players own the game accounts they claim to own as they need to provide the one-time use API token that exists inside the game.
		 * @param {string} playerTag Tag of the player.
		 * @param {string} token Player API token.
		 * @example
		 * client.verifyPlayer('#9Q92C8R20', 'pd3NN9x2');
		 * @returns {Promise<boolean>} Boolean value.
		 */
		public verifyPlayer(playerTag: string, token: string): Promise<boolean>;

		/**
		 * List Leagues
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.leagues();
		 * @returns {Promise<any>} Object
		 */
		public leagues(options?: SearchOptions): Promise<any>;

		/**
		 * Get league information
		 * @param {string} leagueId Identifier of the league.
		 * @example
		 * client.league('29000022');
		 * @returns {Promise<any>} Object
		 */
		public league(leagueId: string): Promise<any>;

		/**
		 * Get league seasons. Note that league season information is available only for Legend League.
		 * @param {string} leagueId Identifier of the league.
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.leagueSeason('29000022', { limit: 10 });
		 * @returns {Promise<any>} Object
		 */
		public leagueSeason(leagueId: string, options?: SearchOptions): Promise<any>;

		/**
		 * Get league season rankings. Note that league season information is available only for Legend League.
		 * @param {string} leagueId Identifier of the league.
		 * @param {string} seasonId Identifier of the season.
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.leagueRanking('29000022', '2020-03', { limit: 10 });
		 * @returns {Promise<any>} Object
		 */
		public leagueRanking(leagueId: string, seasonId: string, options?: SearchOptions): Promise<any>;

		/**
		 * List war leagues
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.warLeagues();
		 * @returns {Promise<any>} Object
		 */
		public warLeagues(options?: SearchOptions): Promise<any>;

		/**
		 * Get war league information
		 * @param {string} leagueId Identifier of the league.
		 * @example
		 * client.warLeague('48000018');
		 * @returns {Promise<any>} Object
		 */
		public warLeague(leagueId: string): Promise<any>;

		/**
		 * List locations
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.locations();
		 * // OR
		 * client.locations({ limit: 10 });
		 * @returns {Promise<any>} Object
		 */
		public locations(options?: SearchOptions): Promise<any>;

		/**
		 * Get information about specific location
		 * @param {string} locationId Identifier of the location to retrieve.
		 * @example
		 * client.locationId('32000107');
		 * @returns {Promise<any>} Object
		 */
		public location(locationId: string): Promise<any>;

		/**
		 * Get clan rankings for a specific location
		 * @param {string} locationId Identifier of the location to retrieve.
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.clanRanks('32000107', { limit: 10 });
		 * @returns {Promise<any>} Object
		 */
		public clanRanks(locationId: string, options?: SearchOptions): Promise<any>;

		/**
		 * Get player rankings for a specific location
		 * @param {string} locationId Identifier of the location to retrieve.
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.playerRanks('32000107', { limit: 10 });
		 * @returns {Promise<any>} Object
		 */
		public playerRanks(locationId: string, options?: SearchOptions): Promise<any>;

		/**
		 * Get clan versus rankings for a specific location
		 * @param {string} locationId Identifier of the location to retrieve.
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.versusClanRanks('32000107', { limit: 10 });
		 * @returns {Promise<any>} Object
		 */
		public versusClanRanks(locationId: string, options?: SearchOptions): Promise<any>;

		/**
		 * Get player versus rankings for a specific location
		 * @param {string} locationId Identifier of the location to retrieve.
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.versusPlayerRanks('32000107', { limit: 10 });
		 * @returns {Promise<any>} Object
		 */
		public versusPlayerRanks(locationId: string, options?: SearchOptions): Promise<any>;

		/**
		 * List clan labels
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.clanLabels();
		 * @returns {Promise<any>} Object
		 */
		public clanLabels(options?: SearchOptions): Promise<any>;

		/**
		 * List player labels
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.playerLabels();
		 * @returns {Promise<any>} Object
		 */
		public playerLabels(options?: SearchOptions): Promise<any>;
	}

	/**
	 * Season Clans (Method: `Client#clans()`)
	 */
	export interface Clans {
		items: {
			tag: string;
			name: string;
			type: string;
			badgeUrls: {
				small: string;
				large: string;
				medium: string;
			};
			location?: {
				localizedName: string;
				id: number;
				name: string;
				isCountry: boolean;
				countryCode: string;
			};
			clanLevel: number;
			clanPoints: number;
			clanVersusPoints: number;
			requiredTrophies: number;
			warFrequency: string;
			warWinStreak: number;
			warWins: number;
			warTies?: number;
			warLosses?: number;
			isWarLogPublic: boolean;
			warLeague?: {
				id: number;
				name: string;
			};
			members: number;
			labels: {
				id: number;
				name: string;
				iconUrls: {
					small: string;
					medium: string;
				};
			}[];
		}[];
		paging: {
			cursors: {
				after?: string;
				before?: string;
			};
		};

		ok: boolean;
		status: number;
		maxAge: number;
	}

	/**
	 * Clan Member Interface
	 */
	export interface ClanMember {
		name: string;
		tag: string;
		role: 'member' | 'admin' | 'coLeader' | 'leader';
		expLevel: number;
		league: {
			id: number;
			name: string;
			iconUrls: {
				small: string;
				tiny: string;
				medium: string;
			};
		};
		trophies: number;
		versusTrophies: number;
		clanRank: number;
		previousClanRank: number;
		donations: number;
		donationsReceived: number;
	}

	/**
	 * Clan Members (Method: `Client#clanMembers()`)
	 */
	export interface ClanMembers {
		items: ClanMember[];
		paging: {
			cursors: {
				after?: string;
				before?: string;
			};
		};
	}

	/**
	 * Clan Interface (Method: `Client#clan(clanTag)`)
	 */
	export interface Clan {
		tag: string;
		name: string;
		type: string;
		description: string;
		location?: {
			localizedName: string;
			id: number;
			name: string;
			isCountry: boolean;
			countryCode: string;
		};
		badgeUrls: {
			small: string;
			large: string;
			medium: string;
		};
		clanLevel: number;
		clanPoints: number;
		clanVersusPoints: number;
		requiredTrophies: number;
		warFrequency: string;
		warWinStreak: number;
		warWins: number;
		warTies?: number;
		warLosses?: number;
		isWarLogPublic: boolean;
		warLeague?: {
			name: string;
			id: number;
		};
		members: number;
		labels: {
			id: number;
			name: string;
			iconUrls?: {
				small: string;
				medium: string;
			};
		}[];
		memberList: ClanMember[];

		ok: boolean;
		status: number;
		maxAge: number;
	}

	/**
	 * Player Troops Interface
	 */
	export interface Troop {
		name: string;
		level: number;
		maxLevel: number;
		village: 'home' | 'builderBase';
	}

	/**
	 * Player Spells Interface
	 */
	export interface Spell extends Troop { }

	/**
	 * Player Heroes Interface
	 */
	export interface Hero extends Troop { }

	/**
	 * Player Achievements Interface
	 */
	export interface Achievements {
		name: string;
		stars: number;
		value: number;
		target: number;
		info: string;
		completionInfo: string | null;
		village: 'home' | 'builderBase';
	}

	/**
	 * Player Interface (Method: `Client#player(playerTag)`)
	 */
	export interface Player {
		name: string;
		tag: string;
		townHallLevel: number;
		townHallWeaponLevel?: number;
		expLevel: number;
		trophies: number;
		bestTrophies: number;
		warStars: number;
		attackWins: number;
		defenseWins: number;
		builderHallLevel?: number;
		versusTrophies?: number;
		bestVersusTrophies?: number;
		versusBattleWins?: number;
		role?: string;
		donations: number;
		donationsReceived: number;
		legendStatistics?: {
			legendTrophies: number;
			bestSeason: {
				id: string;
				rank: number;
				trophies: number;
			};
			currentSeason: {
				trophies: number;
			}
		};
		clan?: {
			tag: string;
			name: string;
			clanLevel: number;
			badgeUrls: {
				small: string;
				large: string;
				medium: string;
			};
		};
		league?: {
			id: number;
			name: string;
			iconUrls: {
				small: string;
				tiny: string;
				medium: string;
			};
		};
		achievements: Achievements[];
		labels: {
			id: number;
			name: string;
			iconUrls: {
				small: string;
				medium: string;
			};
		}[];
		troops: Troop[];
		heroes: Hero[];
		spells: Spell[];

		ok: boolean;
		status: number;
		maxAge: number;
	}

	/**
	 * ClanWar Attack Interface
	 */
	export interface ClanWarAttack {
		order: number;
		attackerTag: string;
		defenderTag: string;
		stars: number;
		destructionPercentage: number;
	}

	/**
	 * ClanWar Opponent Attack
	 */
	export interface ClanWarOpponentAttack extends ClanWarAttack { }

	/**
	 * ClanWar Member Interface (Note the small `h` of `townhallLevel`)
	 */
	export interface ClanWarMember {
		tag: string;
		name: string;
		mapPosition: number;
		townhallLevel: number;
		opponentAttacks: number;
		bestOpponentAttack?: ClanWarOpponentAttack;
		attacks?: ClanWarAttack[];
	}

	/**
	 * ClanWar Clan Interface
	 */
	export interface ClanWarClan {
		tag: string;
		name: string;
		badgeUrls: {
			small: string;
			large: string;
			medium: string;
		};
		clanLevel: number;
		attacks: number;
		stars: number;
		destructionPercentage: number;
		expEarned?: number;
		members: ClanWarMember[];
	}

	/**
	 * ClanWar Opponent Interface
	 */
	export interface ClanWarOpponent extends ClanWarClan { }

	/**
	 * ClanWar Interface
	 */
	export interface ClanWar {
		state: 'notInWar' | 'preparation' | 'inWar' | 'warEnded';
		teamSize: number;
		startTime: string;
		preparationStartTime: string;
		endTime: string;
		clan: ClanWarClan;
		opponent: ClanWarOpponent;

		ok: boolean;
		status: number;
		maxAge: number;
	}

	/**
	 * Clan Current War (Method: `Client#currentClanWar(clanTag)`)
	 */
	export interface CurrentWar extends ClanWar { }

	/**
	 * Clan War League Round (Method: `Client#clanWarLeagueWar(clanTag)`)
	 */
	export interface ClanWarLeagueWar extends CurrentWar { }

	/**
	 * Clan War League Group (Method: `Client#clanWarLeague(clanTag)`)
	 */
	export interface ClanWarLeague {
		state: 'notInWar' | 'preparation' | 'inWar' | 'warEnded';
		season: string;
		clans: {
			name: string;
			tag: string;
			clanLevel: number;
			badgeUrls: {
				small: string;
				large: string;
				medium: string;
			};
			members: {
				name: string;
				tag: string;
				townHallLevel: number;
			}[];
		}[];
		rounds: {
			warTags: string[];
		}[];

		ok: boolean;
		status: number;
		maxAge: number;
	}

	/**
	 * War Log Clan Interface
	 */
	export interface WarLogClan {
		tag: string;
		name: string;
		badgeUrls: {
			small: string;
			large: string;
			medium: string;
		};
		clanLevel: number;
		attacks: number;
		stars: number;
		destructionPercentage: number;
		expEarned: number;
	}

	/**
	 * War Log Opponent Interface (Note: CWL logs don't have `name` and `tag`)
	 */
	export interface WarLogOpponent {
		tag?: string;
		name?: string;
		badgeUrls: {
			small: string;
			large: string;
			medium: string;
		};
		clanLevel: number;
		stars: number;
		destructionPercentage: number;
	}

	/**
	 * Clan War Log (Method: `Client#clanWarLog(clanTag)`)
	 */
	export interface WarLog {
		items: {
			result: 'win' | 'lose' | 'tie' | null;
			endTime: string;
			teamSize: number;
			clan: WarLogClan;
			oppnent: WarLogOpponent;
		}[];
		paging: {
			cursors: {
				after?: string;
				before?: string;
			};
		};

		ok: boolean;
		status: number;
		maxAge: number;
	}

	export interface Label {
		id: number;
		name: string;
		iconUrls: {
			small: string;
			medium: string;
		}
	}

	export interface ClanLabels {
		items: Label[];
		paging: {
			cursors: {
				after?: string;
				before?: string;
			};
		};

		ok: boolean;
		status: number;
		maxAge: number;
	}

	export interface PlayerLabels extends ClanLabels { }
}