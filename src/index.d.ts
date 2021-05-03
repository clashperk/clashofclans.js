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

		readonly tokenIndex: number;
		readonly _tokens: string[];
		readonly _token: string;

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
		 * client.clans({ name: 'air hounds', limit: 10 });
		 * // or
		 * client.clans({ minMembers: 40, maxMembers: 50 });
		 * @returns {Promise<any>} Object
		 */
		public clans(options: ClanSearchOptions): Promise<ClanList>;

		/**
		 * Get clan information
		 * @param {string} clanTag Tag of the clan.
		 * @example
		 * client.clan('#8QU8J9LP');
		 * @returns {Promise<any>} Object
		 */
		public clan(clanTag: string): Promise<Clan>;

		/**
		 * List clan members
		 * @param {string} clanTag Tag of the clan.
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.clanMembers('#8QU8J9LP', { limit: 10 });
		 * @returns {Promise<any>} Object
		 */
		public clanMembers(clanTag: string, options?: SearchOptions): Promise<ClanMemberList>;

		/**
		 * Detailed clan members
		 * @param {{ tag: string }[]} members - List of members
		 * @example
		 * const data = await client.clan('#8QU8J9LP');
		 * client.detailedClanMembers(data.memberList);
		 * @returns {Promise<any[]>} Object
		 */
		public detailedClanMembers(members: { tag: string }[]): Promise<Player[]>;

		/**
		 * Retrieve clan's clan war log
		 * @param {string} clanTag Tag of the clan.
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.clanWarLog('#8QU8J9LP', { limit: 10 });
		 * @returns {Promise<any>} Object
		 */
		public clanWarLog(clanTag: string, options?: SearchOptions): Promise<ClanWarLog>;

		/**
		 * Retrieve information about clan's current clan war
		 * @param {string} clanTag Tag of the clan.
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.currentClanWar('#8QU8J9LP');
		 * @returns {Promise<any>} Object
		 */
		public currentClanWar(clanTag: string, options?: SearchOptions): Promise<ClanWar>;

		/**
		 * Retrieve information about clan's current clan war league group
		 * @param {string} clanTag Tag of the clan.
		 * @example
		 * client.clanWarLeague('#8QU8J9LP');
		 * @returns {Promise<any>} Object
		 */
		public clanWarLeague(clanTag: string): Promise<ClanWarLeagueGroup>;

		/**
		 * Retrieve information about individual clan war league war
		 * @param {string} warTag WarTag of a CWL round.
		 * @example
		 * client.clanWarLeagueWar('#2QJQPYLJU');
		 * @returns {Promise<any>} Object
		 */
		public clanWarLeagueWar(warTag: string): Promise<ClanWar>;

		/**
		 * Get player information.
		 * @param {string} playerTag Tag of the player.
		 * @example
		 * client.player('#9Q92C8R20');
		 * @returns {Promise<any>} Object
		 */
		public player(playerTag: string): Promise<Player>;

		/**
		 * Verify player API token that can be found from the game settings. This API call can be used to check that players own the game accounts they claim to own as they need to provide the one-time use API token that exists inside the game.
		 * @param {string} playerTag Tag of the player.
		 * @param {string} token Player API token.
		 * @example
		 * client.verifyPlayerToken('#9Q92C8R20', 'pd3NN9x2');
		 * @returns {Promise<any>} Object
		 */
		public verifyPlayerToken(playerTag: string, token: string): Promise<VerifyToken>;

		/**
		 * List Leagues
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.leagues();
		 * @returns {Promise<any>} Object
		 */
		public leagues(options?: SearchOptions): Promise<LeagueList>;

		/**
		 * Get league information
		 * @param {string} leagueId Identifier of the league.
		 * @example
		 * client.league('29000022');
		 * @returns {Promise<any>} Object
		 */
		public league(leagueId: string): Promise<League>;

		/**
		 * Get league seasons. Note that league season information is available only for Legend League.
		 * @param {string} leagueId Identifier of the league.
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.leagueSeason('29000022', { limit: 10 });
		 * @returns {Promise<any>} Object
		 */
		public leagueSeason(leagueId: string, options?: SearchOptions): Promise<LeagueSeasonList>;

		/**
		 * Get league season rankings. Note that league season information is available only for Legend League.
		 * @param {string} leagueId Identifier of the league.
		 * @param {string} seasonId Identifier of the season.
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.leagueRanking('29000022', '2020-03', { limit: 10 });
		 * @returns {Promise<any>} Object
		 */
		public leagueRanking(leagueId: string, seasonId: string, options?: SearchOptions): Promise<PlayerSeasonRankingList>;

		/**
		 * List war leagues
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.warLeagues();
		 * @returns {Promise<any>} Object
		 */
		public warLeagues(options?: SearchOptions): Promise<WarLeagueList>;

		/**
		 * Get war league information
		 * @param {string} leagueId Identifier of the league.
		 * @example
		 * client.warLeague('48000018');
		 * @returns {Promise<any>} Object
		 */
		public warLeague(leagueId: string): Promise<WarLeague>;

		/**
		 * List locations
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.locations();
		 * // OR
		 * client.locations({ limit: 10 });
		 * @returns {Promise<any>} Object
		 */
		public locations(options?: SearchOptions): Promise<LocationList>;

		/**
		 * Get information about specific location
		 * @param {string} locationId Identifier of the location to retrieve.
		 * @example
		 * client.locationId('32000107');
		 * @returns {Promise<any>} Object
		 */
		public location(locationId: string): Promise<Location>;

		/**
		 * Get clan rankings for a specific location
		 * @param {string} locationId Identifier of the location to retrieve.
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.clanRanks('32000107', { limit: 10 });
		 * @returns {Promise<any>} Object
		 */
		public clanRanks(locationId: string, options?: SearchOptions): Promise<ClanRankingList>;

		/**
		 * Get player rankings for a specific location
		 * @param {string} locationId Identifier of the location to retrieve.
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.playerRanks('32000107', { limit: 10 });
		 * @returns {Promise<any>} Object
		 */
		public playerRanks(locationId: string, options?: SearchOptions): Promise<PlayerRankingList>;

		/**
		 * Get clan versus rankings for a specific location
		 * @param {string} locationId Identifier of the location to retrieve.
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.versusClanRanks('32000107', { limit: 10 });
		 * @returns {Promise<any>} Object
		 */
		public versusClanRanks(locationId: string, options?: SearchOptions): Promise<ClanVersusRankingList>;

		/**
		 * Get player versus rankings for a specific location
		 * @param {string} locationId Identifier of the location to retrieve.
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.versusPlayerRanks('32000107', { limit: 10 });
		 * @returns {Promise<any>} Object
		 */
		public versusPlayerRanks(locationId: string, options?: SearchOptions): Promise<PlayerVersusRankingList>;

		/**
		 * List clan labels
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.clanLabels();
		 * @returns {Promise<any>} Object
		 */
		public clanLabels(options?: SearchOptions): Promise<LabelList>;

		/**
		 * List player labels
		 * @param {SearchOptions} options Search options (optional)
		 * @example
		 * client.playerLabels();
		 * @returns {Promise<any>} Object
		 */
		public playerLabels(options?: SearchOptions): Promise<LabelList>;

		/**
		 * Get information about the current gold pass season.
		 * @returns {Promise<any>} Object
		 */
		public goldPassSeason(): Promise<GoldPassSeason>;
	}

	// **************** CLANS **************** //

	/**
	 * GET /clans?name=air+hounds&limit=10
	 */
	export interface ClanList {
		items: (Omit<Clan, 'memberList'>)[],
		paging: {
			cursors: {
				after?: string;
				before?: string;
			};
		};

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	/**
	 * GET /clans/{clanTag}
	 */
	export interface Clan {
		tag: string;
		name: string;
		type: string;
		description: string;
		location?: Location;
		chatLanguage?: {
			name: string;
			id: number;
			languageCode: string;
		}
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
		labels: Label[];
		memberList: ClanMember[];

		ok: true;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

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
	 * GET /clans/{clanTag}/members
	 */
	export interface ClanMemberList {
		items: ClanMember[],
		paging: {
			cursors: {
				after?: string;
				before?: string;
			};
		};

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	/**
	 * GET /clans/{clanTag}/currentwar
	 */
	export interface ClanWar {
		state: 'notInWar' | 'preparation' | 'inWar' | 'warEnded';
		teamSize: number;
		startTime: string;
		preparationStartTime: string;
		endTime: string;
		clan: WarClan;
		opponent: WarClan;

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	export interface WarClan {
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

	export interface ClanWarMember {
		tag: string;
		name: string;
		mapPosition: number;
		townhallLevel: number;
		opponentAttacks: number;
		bestOpponentAttack?: ClanWarAttack;
		attacks?: ClanWarAttack[];
	}

	export interface ClanWarAttack {
		order: number;
		attackerTag: string;
		defenderTag: string;
		stars: number;
		duration: number;
		destructionPercentage: number;
	}

	/**
	 * GET /clans/{clanTag}/warlog
	 */
	export interface ClanWarLog {
		items: {
			result: 'win' | 'lose' | 'tie' | null;
			endTime: string;
			teamSize: number;
			clan: Omit<WarClan, 'members'>;
			opponent: Omit<WarClan, 'members' | 'attacks' | 'expEarned'>;
		}[];
		paging: {
			cursors: {
				after?: string;
				before?: string;
			};
		};

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	/**
	 * GET /clans/{clanTag}/currentwar/leaguegroup
	 */
	export interface ClanWarLeagueGroup {
		state: 'notInWar' | 'preparation' | 'inWar' | 'warEnded';
		season: string;
		clans: ClanWarLeagueClan[];
		rounds: ClanWarLeagueRound[];

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	export interface ClanWarLeagueClan {
		name: string;
		tag: string;
		clanLevel: number;
		badgeUrls: {
			small: string;
			large: string;
			medium: string;
		};
		members: ClanWarLeagueClanMember[];
	}

	export interface ClanWarLeagueClanMember {
		name: string;
		tag: string;
		townHallLevel: number;
	}

	export interface ClanWarLeagueRound {
		warTags: string[]
	}

	// GET /clanwarleagues/wars/{warTag}
	// Same as {ClanWar}

	// *************** PLAYERS *************** //

	/**
	 * GET /players/{playerTag}
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
		donations: number;
		donationsReceived: number;
		role?: string;
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
		achievements: PlayerAchievement[];
		troops: PlayerItem[];
		heroes: PlayerItem[];
		spells: PlayerItem[];
		labels: {
			id: number;
			name: string;
			iconUrls: {
				small: string;
				medium: string;
			};
		}[];

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	export interface PlayerAchievement {
		name: string;
		stars: number;
		value: number;
		target: number;
		info: string;
		completionInfo: string | null;
		village: 'home' | 'builderBase';
	}

	export interface PlayerItem {
		name: string;
		level: number;
		maxLevel: number;
		superTroopIsActive?: boolean;
		village: 'home' | 'builderBase';
	}

	/**
	 * POST /players/{playerTag}/verifytoken
	 */
	export interface VerifyToken {
		tag: string;
		token: string;
		status: 'ok' | 'invalid';

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	// ************* LOCATIONS ************* //

	/**
	 * GET /locations
	 */
	export interface LocationList {
		items: Location[];
		paging: {
			cursors: {
				after?: string;
				before?: string;
			};
		};

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	/**
	 * GET /locations/{loacationId}
	 */
	export interface Location {
		localizedName: string;
		id: number;
		name: string;
		isCountry: boolean;
		countryCode: string;

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	/**
	 * GET /locations/{locationId}/rankings/clans
	 */
	export interface ClanRankingList {
		items: ClanRanking[];
		paging: {
			cursors: {
				after?: string;
				before?: string;
			};
		};

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	export interface ClanRanking {
		clanLevel: number;
		clanPoints: number;
		location: Location;
		members: number;
		tag: string;
		name: string;
		rank: number;
		previousRank: number
		badgeUrls: {
			small: string;
			large: string;
			medium: string;
		}
	}

	/**
	 * GET /locations/{locationId}/rankings/players
	 */
	export interface PlayerRankingList {
		items: PlayerRanking[];
		paging: {
			cursors: {
				after?: string;
				before?: string;
			};
		};

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	export interface PlayerRanking {
		tag: string;
		name: string;
		expLevel: number;
		trophies: number;
		attackWins: number;
		defenseWins: number;
		rank: number;
		clan: {
			tag: string;
			name: string;
			badgeUrls: {
				small: string;
				large: string;
				medium: string;
			}
		};
		league: {
			id: number;
			name: string;
			iconUrls: {
				small: string;
				tiny: string;
				medium: string;
			};
		}
	}

	/**
	 * GET /locations/{locationId}/rankings/clans-versus
	 */
	export interface ClanVersusRankingList {
		items: ClanVersusRanking[];
		paging: {
			cursors: {
				after?: string;
				before?: string;
			};
		};

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	export interface ClanVersusRanking {
		clanLevel: number;
		location: Location;
		members: number;
		tag: string;
		name: string;
		rank: number;
		previousRank: number
		badgeUrls: {
			small: string;
			large: string;
			medium: string;
		}
		clanVersusPoints: number;
	}

	/**
	 * GET /locations/{locationId}/rankings/clans-versus
	 */
	export interface PlayerVersusRankingList {
		items: ClanVersusRanking[];
		paging: {
			cursors: {
				after?: string;
				before?: string;
			};
		};

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	export interface PlayerVersusRanking {
		tag: string;
		name: string;
		expLevel: number;
		versusTrophies: number;
		versusBattleWins: number;
		rank: number;
		clan: {
			tag: string;
			name: string;
			badgeUrls: {
				small: string;
				large: string;
				medium: string;
			}
		};
	}

	// *************** LEAGUES *************** //

	/**
	 * GET /leagues
	 */
	export interface LeagueList {
		items: League[];
		paging: {
			cursors: {
				after?: string;
				before?: string;
			};
		};

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	/**
	 * GET /leagues/{leagueId}
	 */
	export interface League {
		id: string;
		name: string;
		iconUrls: {
			tiny: string;
			small: string;
		}

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	/**
	 * GET /leagues/{leagueId}/seasons/{seasonId}
	 */
	export interface PlayerSeasonRankingList {
		items: (Omit<PlayerRanking, 'league'>)[];
		paging: {
			cursors: {
				after?: string;
				before?: string;
			};
		};

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	/**
	 * GET /leagues/{leagueId}/seasons
	 */
	export interface LeagueSeasonList {
		items: {
			id: string;
		}[]
		paging: {
			cursors: {
				after?: string;
				before?: string;
			};
		};

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	/**
	 * GET /warleagues
	 */
	export interface WarLeagueList {
		items: WarLeague[];
		paging: {
			cursors: {
				after?: string;
				before?: string;
			};
		};

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	/**
	 * GET /warleagues/{leagueId}
	 */
	export interface WarLeague {
		id: string;
		name: string;

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	// ************** LABELS ************** //

	/**
	  * GET /labels/players
	  * 
	  * GET /labels/clans
	  */
	export interface LabelList {
		items: Label[];
		paging: {
			cursors: {
				after?: string;
				before?: string;
			};
		};

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}

	export interface Label {
		id: number;
		name: string;
		iconUrls: {
			small: string;
			medium: string;
		}
	}

	// *********** GOLD PASS *********** //

	/**
	 * GET /goldpass/seasons/current
	 */
	export interface GoldPassSeason {
		startTime: string;
		endTime: string;

		ok: boolean;
		maxAge?: number;
		reason?: string;
		message?: string;
		statusCode: number;
	}
}
